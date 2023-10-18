import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { fetchUserData, selectIsAuth } from '../../redux/slices/authSlice'
import styles from './Login.module.scss'

export const Login = () => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			email: 'LASw@ya.ru',
			passwordHash: '12345678',
		},
		mode: 'onChange',
	})

	const onSubmit = values => {
		console.log(values)
		dispatch(fetchUserData(values))
	}

	if (isAuth) {
		return <Navigate to='/' />
	}

	// console.log(isAuth, 'isAuth')
	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Вход в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label='E-Mail'
					type='email'
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register('email', { required: 'Укажите почту' })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label='Пароль'
					error={Boolean(errors.passwordHash?.message)}
					helperText={errors.passwordHash?.message}
					{...register('passwordHash', { required: 'Укажите пароль' })}
					fullWidth
				/>
				<Button type='submit' size='large' variant='contained' fullWidth>
					Войти
				</Button>
			</form>
		</Paper>
	)
}
