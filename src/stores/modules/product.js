import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('products', {
    state: () => ({
        selectedGroup: '',
        selectedBrand: '',
        selectedSize: '',
        selectedFlavour: '',
        productOption: {
            group: [],
            brand: [],
            size: [],
            flavour: [],
        },
        productUnitDetail: {
            id: '',
            unitId: '',
            qty: 1,
        },
        productId: '',
        productList: [],
        saleProductList: [],
        productDetail: [],
        productUnit: [],
    }),
    actions: {
        resetProduct() {
            (this.productUnitDetail.unitId = ''), (this.productUnitDetail.qty = 1)
        },
        setProduct(id) {
            localStorage.setItem('productId', id)
            this.productId = id
            this.productUnitDetail.id = id
        },
        async updateProductData(data) {
            this.productUnitDetail = data
            await this.getProductDetail()
        },
        updateSelectedOptions(group, brand, size, flavour) {
            this.selectedGroup = group
            this.selectedBrand = brand
            this.selectedSize = size
            this.selectedFlavour = flavour

            this.getProduct()
        },
        updateSaleOptions(group, brand, size, flavour) {
            this.selectedGroup = group
            this.selectedBrand = brand
            this.selectedSize = size
            this.selectedFlavour = flavour

            this.getSaleProduct()
        },
        async getDataOpion(selectedGroup, selectedBrand, selectedSize, selectedFlavour) {
            try {
                //   const token = JSON.parse(localStorage.getItem('token'));
                const response = await axios.post(
                    import.meta.env.VITE_API_BASE_URL + '/cms/saleProduct/getDataOption',
                    {
                        group: selectedGroup,
                        brand: selectedBrand,
                        size: selectedSize,
                        flavour: selectedFlavour
                    }
                    // {
                    //   headers: { Authorization: `Bearer ${token}` },
                    // }
                )
                const result = response.data
                this.productOption.group = result.group
                this.productOption.brand = result.brand
                this.productOption.size = result.size
                this.productOption.flavour = result.flavour
                // console.log('option', this.productOption)
            } catch (error) {
                console.error(error)
            }
        },
        async getProduct() {
            try {
                //   const token = JSON.parse(localStorage.getItem('token'));
                const response = await axios.post(
                    import.meta.env.VITE_API_BASE_URL +
                    '/cms/saleProduct/getProduct',
                    {
                        group: this.selectedGroup,
                        brand: this.selectedBrand,
                        size: this.selectedSize,
                        flavour: this.selectedFlavour
                    }
                    // {
                    //   headers: { Authorization: `Bearer ${token}` },
                    // }
                )
                this.productList = response.data
                // console.log('product', this.productList)
            } catch (error) {
                console.error(error);
            }
        },
        async getSaleProduct() {
            try {
                //   const token = JSON.parse(localStorage.getItem('token'));
                const response = await axios.post(
                    import.meta.env.VITE_API_BASE_URL +
                    '/cms/saleProduct/getProduct',
                    {
                        statusSale: 'Y',
                        group: this.selectedGroup,
                        brand: this.selectedBrand,
                        size: this.selectedSize,
                        flavour: this.selectedFlavour
                    }
                    // {
                    //   headers: { Authorization: `Bearer ${token}` },
                    // }
                )
                this.saleProductList = response.data
                // console.log('product', this.productList)
            } catch (error) {
                console.error(error);
            }
        },
        async getProductDetail() {
            try {
                //   const token = JSON.parse(localStorage.getItem('token'));
                const localProductId = localStorage.getItem('productId')
                if (!localProductId) return;
                this.productUnitDetail.id = localProductId;
                const response = await axios.post(
                    import.meta.env.VITE_API_BASE_URL + '/cms/saleProduct/getProductDetailUnit',
                    this.productUnitDetail

                    // {
                    //   headers: { Authorization: `Bearer ${token}` },
                    // }
                );
                this.productDetail = response.data
                this.productUnit = response.data.unitList
                console.log('productDetail', this.productDetail)
            } catch (error) {
                console.error(error);
            }
        },
    },
});
