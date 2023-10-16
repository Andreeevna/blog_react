import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import instance from '../axios'
import { Index } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'
import { Post } from '../components/Post'

export const FullPost = () => {
	const [data, setData] = useState()
	const [isLoading, setIsLoading] = useState(true)

	const { id } = useParams()

	React.useEffect(() => {
		instance
			.get(`/posts/${id}`)
			.then(res => {
				setData(res.data)
				setIsLoading(false)
			})
			.catch(err => {
				console.warn(err)
				alert('Ошибка при получении статьи')
			})
	}, [])

	if (isLoading) {
		return <Post isLoading={isLoading} isFullPos />
	}
	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl='https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png'
				user={{
					avatarUrl: data.avatarUrl,
					fullName: data.fullName,
				}}
				createdAt={data.createdAt}
				viewsCount={data.viewsCount}
				commentsCount={3}
				tags={data.tags}
				isFullPos
			>
				<p>{data.text}</p>
			</Post>
			<CommentsBlock
				items={[
					{
						user: {
							fullName: 'Вася Пупкин',
							avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
						},
						text: 'Это тестовый комментарий 555555',
					},
					{
						user: {
							fullName: 'Иван Иванов',
							avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
						},
						text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
					},
				]}
				isLoading={false}
			>
				<Index />
			</CommentsBlock>
		</>
	)
}
