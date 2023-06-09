import { useQuery } from '@tanstack/react-query'
import MyPageApi from '../../Apis/mypageApi'
import QUERY_KEY from '../../Consts/query.key'

const getMyInterest = async page => {
	const { data } = await MyPageApi.likeProduct(page)
	return data
}

const useGetMyInterest = page => {
	const { data, error, status, isLoading, isError, refetch, fetchStatus } =
		useQuery([QUERY_KEY.GET_MYINTEREST], () => getMyInterest(page), {
			cacheTime: 1000 * 5 * 60,
			staleTime: 1000 * 1 * 60,
		})

	return { data, error, status, isLoading, isError, refetch, fetchStatus }
}

export default useGetMyInterest
