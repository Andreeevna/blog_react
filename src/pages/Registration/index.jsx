import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { fetchRegister, selectIsAuth } from '../../redux/slices/authSlice'
import styles from './Login.module.scss'

export const Registration = () => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			fullName: 'Василий',
			email: 'Vasya@ya.ru',
			passwordHash: '12345',
		},
		mode: 'onChange',
	})

	const onSubmit = async values => {
		const data = await dispatch(fetchRegister(values))

		if (!data.payload) {
			alert('Не удалось зарегистрироваться')
		}

		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token)
		}
	}

	if (isAuth) {
		return <Navigate to='/' />
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label='Полное имя'
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: 'Укажите полное имя' })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label='E-Mail'
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
				<Button
					disabled={!isValid}
					type='submit'
					size='large'
					variant='contained'
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	)
}
