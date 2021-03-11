import React, {useMemo, useState} from 'react';
import {useQuery} from "@apollo/react-hooks";
import {GEL_POST_DETAILS, DELETE_COMMENT, ADD_COMMENT, UPDATE_COMMENT} from './queries/Queries'
import {useMutation} from '@apollo/client'
import PropTypes from 'prop-types';
import { useFormik } from "formik";
import * as Yup from "yup";

const PostDetails = (props) => {
    const {id} = props.match.params;
    let [showCommentForm, setComments] = useState(false);
    let [commentAction, setAction] = useState("Add");
    let [cmtValues, setValues] = useState({id:'',comment:'', post_id: id});
    const {data, loading, error} =  useQuery(GEL_POST_DETAILS,{
        variables:{id: id}
    })
   
    //Save comment
    const [saveComment, {loading : commentLoading, error : commentError}] = useMutation(ADD_COMMENT,{
        refetchQueries:[
            {
                query:GEL_POST_DETAILS,
                variables:{id: id}
            }],
        onCompleted: (data) => {
            setComments(false)
            alert('Comment added succesfully..')
         },
         onError(err) {
           console.log('Error', err)
        } 
    });

    //update comment
    const [updateComment, {loading : upCommentLoading, error : upCommentError}] = useMutation(UPDATE_COMMENT,{
        // refetchQueries:[
        //     {
        //         query:GEL_POST_DETAILS,
        //         variables:{id: id}
        //     }],
        onCompleted: (data) => {
            setComments(false)
            alert('Comment updated succesfully..')
         },
         onError(err) {
           console.log('Error', err)
        } 
    });
    
    
    //Add/Update comment form
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
          comment: cmtValues.comment,
          post_id:cmtValues.post_id
        },
        validationSchema: Yup.object({
            comment: Yup.string()
              .min(2, "Mininum 2 characters")
              .max(200, "Maximum 2000 characters")
              .required("Please enter comment!"),
              post_id: Yup.string()
              .required("Required!"),
          }),
          onSubmit: (values, {resetForm}) => {
            if(commentAction === 'Add') {
                saveComment({ variables: values }); // API call from here 
            } else {
                values = {...values,id:cmtValues.id}
                updateComment({ variables: values });
            }
            
            resetForm(); 
          }
      });

    //Delete comment
    const [deleteComment, {loading : deleteLoading}] =  useMutation(DELETE_COMMENT,{
        refetchQueries:[
            {
                query:GEL_POST_DETAILS,
                variables:{id: id}
            }
        ],
        onCompleted: (data) => {
            alert('Comment deleted succesfully..')
         },
         onError(err) {
           console.log('Error', err)
        } 
    })

    const details = data?.posts_by_pk;
    const comments = data?.posts_by_pk?.comments;
    const renderDetails = useMemo(() => {
        return details
    },[details])

    const renderComments = useMemo(() => {
        return comments
    },[comments])

    
    if(error) {
        return `Error...${error.message}`
    }
    
    const onDeleteComment = (cmt_id) => {
        deleteComment({ variables: {'id':cmt_id} })
    }

    const addComment = () => {
        setComments(true)
        setAction("Add")
    }

    const onEditComment = (comment) => {
        setComments(true)
        setAction("Update")
        setValues(
            {
                id:comment.id,
                comment: comment.comment,
                post_id: comment.post_id
            }
        )
    }
    
    return(
        <div className="container">
            <h1>Posts Details</h1>
            {(commentLoading || loading || deleteLoading || upCommentLoading) && (<span className="loading-msg">Loading...</span>)}

            {(commentError || error || upCommentError) && (<span className="error-msg">Something went wrong!.</span>)}

            {renderDetails && !loading && (
                <div>
                <div className="well">
                    <div className="media">
                        <div className="media-body">
                        <h4 className="media-heading">{renderDetails?.title}</h4> 
                        <p className="text-right"><b>By {renderDetails?.user?.name}</b></p>
                        <p>{renderDetails?.description}</p>
                    </div>
                </div>
                </div> 
                <h1>Comments</h1>
                <div className="row">
                    <div className="col-xs-2 col-md-2 float-right">
                        <button className="btn btn-primary"  onClick={() => addComment()} >Add Comment</button>
                    </div>

                    {/* Add/Update comment form */}
                    {showCommentForm && ( <form className="mr20px col-md-12" onSubmit={formik.handleSubmit}>
                        <div className="form-group ">
                            <label >Comment</label>
                            <textarea 
                            name="comment"
                            className={`form-control ${formik.errors.comment && formik.touched.comment ? 'input-error': ' '}`}
                            value={formik.values.comment} 
                            onChange={formik.handleChange}></textarea>
                        
                        {formik.errors.comment && formik.touched.comment && (
                            <span className="error">{formik.errors.comment}</span>
                        )}
                    </div>
                    <div className="col-xs-2 col-md-2 float-right">
                        <button type="submit" className="btn btn-primary"> {commentAction}</button>
                        <button  className="btn btn-danger" onClick={() => setComments(false)}> Cancel</button>
                    </div>
                    
                    </form> )}
                    {/* END :: Add/Update comment form */}
                    
                </div>
                
               

                
                {renderComments.length > 0 
                && renderComments.map((comment,i) => {
                    return <div key={i} className="panel-body">
                    <ul className="list-group">
                        <li className="list-group-item">
                            <div className="row">
                                <div className="col-xs-11 col-md-11">
                                    <div className="comment-text">
                                    {comment.comment}
                                    </div>
                                </div>
                                <div className="col-xs-1 col-md-1">
                                    <button className="btn btn-danger float-right" onClick={() => onDeleteComment(comment.id)} >Delete</button>
                                    <button className="btn btn-primary float-right" onClick={() => onEditComment(comment)} >Edit</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                }) }
                {renderComments.length === 0  && (<h1>No Comments added.</h1>)}
                </div>
                
            )}
            {!renderDetails && !loading && (<h1>Something went wrong.</h1>)} 
        </div>
    )
}

PostDetails.propTypes = {
    posts_by_pk: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        comments: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number,
              comment: PropTypes.string
            })
        ),
        user: PropTypes.objectOf(
          PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
          })
      )
      })
    ),
  };
export default PostDetails;
