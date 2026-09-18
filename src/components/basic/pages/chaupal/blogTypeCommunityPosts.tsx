import { useCommunityReels } from '@/hooks/useCommunityReels'
import { useEffect } from 'react'
import Skelton from '../../Skelton'
import MyPostItem from './myPostItem'

const BlogTypeCommunityPosts = () => {

    const { fetchPosts, loading, posts } = useCommunityReels({
        pageLimit: 2,
    })

    useEffect(() => {
        !posts?.length && fetchPosts()
    }, [posts])

    return (
        loading
            ? <Skelton dimensions={{ height: 200 }} />
            : posts?.length
                ? posts?.map((el, i) => <MyPostItem detail={el} key={i} />)
                : null
    )
}

export default BlogTypeCommunityPosts