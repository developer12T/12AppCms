<template>
    <LayoutSub>
        <template v-slot>
            <div class="flex flex-col h-full">
                <div class="flex flex-row items-center">
                    <div class="mt-2">
                        <ButtonBack />
                    </div>
                    <div class="mt-2 ml-2 flex items-center">
                        <Icon icon="uil:cart" class="icon sm:h-8 sm:w-8 md:h-10 md:w-10" />
                        <span class="ml-2 sm:text-lg md:text-3xl">สั่งซื้อสินค้า</span>
                    </div>
                </div>
                <div class="flex flex-col mt-4">
                    <div class="ml-12 text-xl">
                        รหัส : {{ storeId }}
                    </div>
                    <div class="ml-12 text-xl">
                        ร้าน : {{ storeName }}
                    </div>
                </div>
                <div>
                    <MobileOptionProduct v-if="isMobile" @update:data="updateOption" />
                    <TabletOptionProduct v-else @update:data="updateOption" />

                </div>
                <div class="flex justify-center mt-5">
                    <Table :columns="tableColumns" :data="dataProducts"
                        :thClass="'px-10 py-3 text-center sm:text-sm md:text-lg'"
                        :tdClass="'px-6 py-2 sm:text-sm md:text-lg text-start'" :hTable="'sm:h-[390px] md:h-[600px]'">
                        <template v-slot:button="{ rowData }">
                            <button type="button"
                                class="text-white bg-green-500 w-6 h-6 font-medium rounded-md text-md inline-flex flex-col items-center justify-center"
                                @click="handleClick(rowData.id)">
                                <Icon class="icon w-4 h-4" icon="ph:plus-bold" />
                            </button>
                        </template>
                    </Table>
                </div>
                <div class="flex justify-end mt-3 mr-5">
                    <router-link to="/cms/order/cart">
                        <ButtonCart :icon="'bytesize:cart'" :cart="dataCartAmount" />
                    </router-link>
                </div>
            </div>
        </template>
    </LayoutSub>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useOrderStore, useProductStore } from '../../stores'
import { useRouter } from 'vue-router'
import { useDisplaySize } from '../../composable/DisplaySize'
import LayoutSub from '../LayoutSub.vue'
import ButtonBack from '../../components/ButtonBack.vue'
import TabletOptionProduct from '../../components/tablet/OptionProduct.vue'
import MobileOptionProduct from '../../components/mobile/OptionProduct.vue'
import Table from '../../components/Table.vue'
import ButtonCart from '../../components/ButtonCircle.vue'

const { isMobile } = useDisplaySize()
const order = useOrderStore()
const product = useProductStore()
const dataProducts = computed(() => {
    return product.saleProductList
})
const dataCartAmount = computed(() => {
    return order.orderCartAmount
})
const storeId = localStorage.getItem('routeStoreId')
const storeName = localStorage.getItem('routeStoreName')

const tableColumns = computed(() => {
    if (isMobile.value) {
        return [
            { id: 'name', title: 'สินค้า' },
            { id: '', title: '' },
        ]
    } else {
        return [
            { id: 'id', title: 'รหัส' },
            { id: 'name', title: 'สินค้า' },
            { id: '', title: '' },
        ]
    }
})

const updateOption = (optionProduct) => {
    product.updateSelectedOptions(
        optionProduct.selectedGroup,
        optionProduct.selectedBrand,
        optionProduct.selectedSize,
        optionProduct.selectedFlavour
    )
    product.getSaleProduct()
}

const router = useRouter()
const handleClick = (id) => {
    product.setProduct(id)
    router.push('/cms/order/product')
}

onMounted(() => {
    product.getSaleProduct()
    order.getOrderCart()
})

</script>
