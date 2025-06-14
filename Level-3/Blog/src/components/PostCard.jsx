import React from 'react'
import appwriteservice from '../appwrite/config'
import {Link} from 'react-router-dom'


function PostCard({$id, title, featuredImage}) {
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                 <img src={appwriteservice.getFilePreview(featuredImage)} alt="{title}" className='rounded-xl'>
                    <h2 className='text-xl font-bold '>{title}</h2>
                 </img>
           
            </div>
        </div>
    </Link>
  )
}

export default PostCard