import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import React, { useEffect } from 'react'
import SimpleMDE from 'react-simplemde-editor'

import 'easymde/dist/easymde.min.css'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import instance from '../../axios'
import { selectIsAuth } from '../../redux/slices/authSlice'
import styles from './AddPost.module.scss'

export const AddPost = () => {
	const navigate = useNavigate()
	const isAuth = useSelector(selectIsAuth)
	const { id } = useParams()
	const isEditing = Boolean(id)

	const [isLoading, setIsLoading] = React.useState(false)
	const [text, setText] = React.useState('')
	const [title, setTitle] = React.useState('')
	const [tags, setTags] = React.useState('')
	const [imageUrl, setImageUrl] = React.useState('')
	const inputFileRef = React.useRef(null)

	const handleChangeFile = async event => {
		try {
			const formData = new FormData()
			const file = event.target.files[0]
			formData.append('image', file)
			const { data } = await instance.post('/upload', formData)
			setImageUrl(data)
		} catch (err) {
			console.warn(err)
			alert('Ошибка при загрузке файла')
		}
	}

	const onClickRemoveImage = () => {
		setImageUrl('')
	}

	const onChange = React.useCallback(value => {
		setText(value)
	}, [])

	const onSubmit = async () => {
		try {
			setIsLoading(true)
			const fields = {
				title,
				text,
				tags,
				imageUrl: imageUrl.url,
			}
			const { data } = isEditing
				? await instance.patch(`/posts/${id}`, fields)
				: await instance.post('/posts', fields)
			const _id = isEditing ? id : data._id

			navigate(`/posts/${_id}`)
		} catch (err) {
			console.warn(err)
			alert('Ошибка при создании статьи')
		}
	}

	useEffect(() => {
		if (id) {
			instance
				.get(`/posts/${id}`)
				.then(({ data }) => {
					setTitle(data.title)
					setText(data.text)
					setTags(data.tags.join(','))
					setImageUrl(data.imageUrl)
				})
				.catch(err => {
					console.log(err)
					alert('Ошибка при получении статьи')
				})
		}
	}, [])

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	)

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/' />
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant='outlined'
				size='large'
			>
				Загрузить превью
			</Button>
			<input
				ref={inputFileRef}
				type='file'
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<>
					<Button
						variant='contained'
						color='error'
						onClick={onClickRemoveImage}
					>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={
							imageUrl?.url
								? `http://localhost:4444${imageUrl.url}`
								: `http://localhost:4444${imageUrl}`
						}
						alt='Uploaded'
					/>
				</>
			)}

			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant='standard'
				placeholder='Заголовок статьи...'
				value={title}
				onChange={e => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant='standard'
				placeholder='Тэги'
				value={tags}
				onChange={e => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size='large' variant='contained'>
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<a href='/'>
					<Button size='large'>Отмена</Button>
				</a>
			</div>
		</Paper>
	)
}
