import { createBrowserRouter } from 'react-router-dom'
import Layout from '../Components/Layout'
import Main from '../Pages/Main'
import List from '../Pages/List'
import Detail from '../Pages/Detail'
import MyBank from '../Pages/MyPage/Pages/MyBank'
import MyInterest from '../Pages/MyPage/Pages/MyInterest'
import MyPrdRegister from '../Pages/MyPage/Pages/MyPrdRegister'
import RecentPrice from '../Pages/RecentPrice'
import Register from '../Pages/Register'
import Search from '../Pages/Search'
import Login from '../Pages/Form/Login/Login'
import SignUp from '../Pages/Form/SignUp/SignUp'
import ChangePW from '../Pages/MyPage/UserEdit/Pages/ChangePW/ChangePW'
import UserInfo from '../Pages/MyPage/UserEdit/Pages/UserInfo/UserInfo'
import MyPageNav from '../Pages/MyPage/Components/Navigation/Navigation'
import MyPageIndex from '../Pages/MyPage/Components/Header'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <Main />,
			},
			{
				path: '/list/:category',
				element: <List />,
			},
			{
				path: '/detail/:idx',
				element: <Detail />,
			},
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/signup',
				element: <SignUp />,
			},
			{
				path: '',
				element: <MyPageIndex />,
				children: [
					{
						path: '/mypage-bank',
						element: <MyBank />,
					},
					{
						path: '/mypage-interest',
						element: <MyInterest />,
					},
					{
						path: '/mypage-register',
						element: <MyPrdRegister />,
					},
				],
			},
			{
				path: '',
				element: <MyPageNav type={'userEdit'} />,
				children: [
					{
						path: '/mypage/useredit-changepw',
						element: <ChangePW />,
					},
					{
						path: '/mypage/useredit-userinfo',
						element: <UserInfo />,
					},
				],
			},
			{
				path: '/recent-price',
				element: <RecentPrice />,
			},
			{
				path: '/register/:prdname',
				element: <Register />,
			},
			{
				path: '/search/:word',
				element: <Search />,
			},
		],
	},
])

export default router
