import API from "@/constants/api"
import { EComProduct } from "@/models/eComProduct"
import { useCallback, useState } from "react"

interface Products {
    data: EComProduct[],
    error: string | null
    loading: boolean
}
const InitialData: Products = {
    data: [], error: null, loading: false
}
export default function useECommerce() {

    const [products, setProducts] = useState<Products>(InitialData)

    const fetchProducts = useCallback(() => {
        setProducts((prev) => ({ ...prev, loading: true }))
        API.get('/v1/products')
            .then((res) => {
                if (res.data?.status == 'success') {
                    setProducts((prev) => ({ ...prev, data: res.data?.data }))
                }
                if (res.data?.status == 'error') {
                    setProducts((prev) => ({ ...prev, error: res.data?.msg || "Couldn't fetch products, try again" }))
                }
            })
            .catch((err) => {
                setProducts((prev) => ({ ...prev, error: err || "Couldn't fetch products, try again" }))
            }
            )
            .finally(() => {
                setProducts((prev) => ({ ...prev, loading: false }))
            })
    }, [])

    return {
        products,
        fetchProducts
    }
}