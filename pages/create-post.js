import Layout from '../components/Layout'
import Link from 'next/link'
import {useMemo} from 'react'
import {useQuery, useMutation} from "@apollo/react-hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from 'prop-types';
import Router from 'next/router'
import {GET_ALL_USERS, CREATE_POST, GET_ALL_POSTS} from '../queries/Queries'

const CreatePost = () => {
   // let history = useHistory();
    const {data} = useQuery(GET_ALL_USERS);
    const users = data?.users;
    const renderUsers = useMemo(() => {
        return users
    },[users])
    let success;
    const [createPost, {loading, error}] = useMutation(CREATE_POST,{
        refetchQueries:[{query:GET_ALL_POSTS}],
        onCompleted: (data) => {
            alert('Post created succesfully..')
            Router.push({
                pathname: '/',
              })
         },
         onError(err) {
           console.log('Error', err)
        } 
    });
    
    const formik = useFormik({
        initialValues: {
          title: "",
          description: "",
          user_id:""
        },
        validationSchema: Yup.object({
            title: Yup.string()
              .min(2, "Mininum 2 characters")
              .max(200, "Maximum 200 characters")
              .required("Please enter title!"),
            description: Yup.string()
              .min(2, "Mininum 2 characters")
              .max(2000, "Maximum 200 characters")
              .required("Please enter description!"),
            user_id: Yup.string()
              .required("Please select user!"),
          }),
          onSubmit: (values, {resetForm}) => {
            //alert(JSON.stringify(values, null, 2));
            createPost({ variables: values }); // API call from here 
            resetForm(); 
          }
      });
    return(
        <Layout title="Create new post">
            <section>
            <h3 className="mr20px" >Create Post</h3>
            {loading && (<span className="loading-msg">Loading...</span>)}

                {error && (<span className="error-msg">Something went wrong!.</span>)}

                {/* { success  && (
                    <span className="success-msg">Post Created Successfully</span>
                )} */}
                
                <Link  href="/"><a className="btn btn-success float-right mr20px" >Back To List</a></Link>

            <form className="mr20px col-md-6" onSubmit={formik.handleSubmit}>
            <div className="form-group ">
                <label >Title</label>
                <input 
                type="text" 
                name="title"
                className={`form-control ${formik.errors.title && formik.touched.title ? 'input-error': ' '}`}
                value={formik.values.title} 
                onChange={formik.handleChange} 
                placeholder="Enter Name" />
            
            {formik.errors.title && formik.touched.title && (
                <span className="error">{formik.errors.title}</span>
            )}
            
            </div>

            <div className="form-group">
                <label>Description:</label>
                <textarea 
                name="description"
                className={`form-control ${formik.errors.description && formik.touched.description ? 'input-error': ' '}`}
                value={formik.values.description} 
                onChange={formik.handleChange}></textarea>
                {formik.errors.description && formik.touched.description && (
                    <span className="error">{formik.errors.description}</span>
                )}
            </div>

            <div className="form-group">
                <label>User:</label>
                <select
                    className={`form-control ${formik.errors.user_id && formik.touched.user_id ? 'input-error': ' '}`}
                    name="user_id"
                    value={formik.values.user_id}
                    onChange={formik.handleChange} 
                >
                    <option value="">Select User</option>
                    {renderUsers && renderUsers.map((user, i)=> {
                        return <option key={i} value={user.id}>{user.name}</option>
                    })}
                    
                </select>
                {formik.errors.user_id && formik.touched.user_id && (
                    <span className="error">{formik.errors.user_id}</span>
                )}
                </div>

            <button type="submit" className="btn btn-primary">Add</button>
            </form>
            </section>
        </Layout>
    )
}

export default CreatePost;