import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import ItemBox from '../../../Components/ItemBox/ItemBox'
import { ColumnNumberCSS, GridCenterCSS } from '../../../Styles/common'

function ProductListWrapper() {
	const navigate = useNavigate()
	const [productList, setProductList] = useState(() => []) //Product List
	const [page, setPage] = useState(1) //현재 페이지
	const preventRef = useRef(false) //옵저버 중복 실행 방지
	const obsRef = useRef(null) //observer Element

	useEffect(() => {
		//옵저버 생성
		const observer = new IntersectionObserver(obsHandler, { threshold: 0.5 })
		if (obsRef.current) observer.observe(obsRef.current)
		return () => {
			observer.disconnect()
		}
	}, [])

	useEffect(() => {
		getProduct()
	}, [page])

	// 옵저버 핸들러
	const obsHandler = entries => {
		const target = entries[0]
		if (target.isIntersecting && preventRef.current) {
			preventRef.current = false
			setPage(prev => prev + 1)
		}
	}

	//상품 불러오기
	const getProduct = useCallback(async () => {
		try {
			const res = await axios.get('/api/products', {
				params: {
					page: page,
					pageSize: 10,
				},
			})
			setProductList(prev => [...prev, ...res.data]) //리스트 추가
			preventRef.current = true
		} catch (e) {
			console.error(e)
		} finally {
		}
	}, [page])

	return (
		<S.ProductList>
			{productList.map((item, idx) => {
				return (
					<ItemBox
						title={item.title}
						price={item.price}
						posterPath={item.image_url}
						context={item.script}
						isLiked={item.liked}
						key={idx}
						onClick={() => navigate(`/detail/${item.idx}`)}
					/>
				)
			})}
			<li className="" ref={obsRef} />
		</S.ProductList>
	)
}

export default ProductListWrapper

const ProductList = styled.div`
	width: 100%;
	margin-top: 4rem;
	${GridCenterCSS}
	${ColumnNumberCSS(4)};

	@media screen and (max-width: ${({ theme }) => theme.MEDIA.mobile}) {
		${ColumnNumberCSS(2)}
		column-gap: 1rem;
	}
`

const S = {
	ProductList,
}