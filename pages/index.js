import Layout from '../components/Layout'
import Link from 'next/link'
import {useMemo} from 'react';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {GET_ALL_POSTS, DELETE_POST} from '../queries/Queries'
import PropTypes from 'prop-types';

const Posts = () => {
    const {data, loading, error} = useQuery(GET_ALL_POSTS);
    const postList = data?.posts;
    const renderPost = useMemo(() => {
        return postList
    },[postList])
    const [deletePost, {error: onDeleteError, loading : deleteLoading}] =  useMutation(DELETE_POST,{
        refetchQueries:[
            {
                query:GET_ALL_POSTS,
            }
        ],
        onCompleted: (data) => {
            alert('Post deleted succesfully..')
         },
         onError(err) {
           console.log('Error', err)
        } 
    })

    if(loading || deleteLoading) {
        return `Loading...`
    }
    if(error) {
        return `Error...${error.message}`
    }
    
    const onDeletePost = (post_id) => {
        deletePost({ variables: {'id':post_id} })
    }
  return (
    <Layout title="Post list page">
       
            <h1>Posts</h1>
            {renderPost.length > 0 && renderPost.map((post, i) => {
                return  <div key={i} className="well">
                <div className="media">
                    <div className="media-body">
                    <Link prefetch as={`/post-details/${post.id}`} href={`/post-details?id=${post.id}`}   >  
                       <a><h4 className="media-heading">{post?.title}</h4></a>  
                    </Link>
                    <p className="text-right"><b>By {post?.user?.name}</b></p>
                    <p>{post?.description}</p>
                    <ul className="list-inline list-unstyled">
                        <span><i className="glyphicon glyphicon-comment"></i> {post?.comments_aggregate?.aggregate?.count} comments</span>
                    </ul>
                </div>
               
                <div className="col-xs-1 col-md-1 float-right">
                    <button className="btn btn-danger " onClick={() => onDeletePost(post.id)} >Delete</button>
                </div><Link prefetch as={`/update-post/${post.id}`} href={`/update-post?id=${post.id}`}  ><a className="btn btn-success ">Update</a></Link>
                <div className="col-xs-1 col-md-1 float-right">
                    {/* <button className="btn btn-primary"  >Update</button> */}
                    
                </div>
                </div>
            </div> 
            })}
            
            {renderPost.length === 0 && (<h2>No post found.</h2>)}
        
    </Layout>
    )
}

Posts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      comments_aggregate: PropTypes.objectOf(
          PropTypes.shape({
            count: PropTypes.number
          })
      ),
      posts_aggregate: PropTypes.objectOf(
          PropTypes.shape({
            count: PropTypes.number
          })
      ),
      user: PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string
        })
    )
    })
  ),
};
export default Posts;

