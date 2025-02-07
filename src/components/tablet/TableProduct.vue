<template>
    <div class="flex flex-row justify-center mt-3">
        <div class="mx-4">
            <Dropdown :dropdownId="'brand'" :btClass="'w-60'" :dropdownItems="optionData" />
        </div>
        <div class="mx-4">
            <Dropdown :dropdownId="'brand'" :btClass="'w-60'" :dropdownItems="optionData" />
        </div>
    </div>
    <div class="flex flex-row justify-center mt-3">
        <div class="mx-4">
            <Dropdown :dropdownId="'brand'" :btClass="'w-60'" :dropdownItems="optionData" />
        </div>
        <div class="mx-4">
            <Dropdown :dropdownId="'brand'" :btClass="'w-60'" :dropdownItems="optionData" />
        </div>
    </div>
    <div class="flex justify-center mt-5">
        <Table :columns="tableColumns" :data="products" :thClass="'px-10 py-3'" :tdClass="'px-10 py-2'"
            :hTable="'h-[600px]'">
            <template v-slot:button="{ rowData }">
                <button type="button"
                    class="text-white bg-green-500 w-6 h-6 font-medium rounded-md text-md inline-flex flex-col items-center justify-center"
                    @click="handleClick(rowData.id)">
                    <Icon class="icon w-4 h-4" icon="ph:plus-bold" />
                </button>
            </template>
        </Table>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useOrderStore, useProductStore } from '../../stores'
import { Icon } from '@iconify/vue'
import Table from '../Table.vue'
import Dropdown from '../../components/tablet/Dropdown.vue'
// import Dropdown2 from '../components/Dropdown.vue'
export default {
    components: {
        Icon,
        Table,
        Dropdown,
        // Dropdown2,
    },
    setup() {

        // const option = useProductStore()
        const store = useOrderStore()
        const products = computed(() => {
            return store.productList
        });

        const tableColumns = computed(() => {
            return [
                { id: 'id', title: 'รหัสสินค้า' },
                { id: 'name', title: 'ชื่อสินค้า' },
                { id: '', title: '*' },
            ];
        });

        const handleClick = (id) => {
            store.setProduct(id)
            // console.log(`item: ${id}`)
        };

        // const optionData = computed(() => ({
        //     // return [
        //         group: { label: 'group', op: store.option, buttonText: 'กลุ่ม' },
        //         brand: { label: 'brand', op: store.productOption.brand, buttonText: 'ยี่ห้อ' },
        //         size: { label: 'size', op: store.productOption.size, buttonText: 'ขนาด' },
        //         flavour: { label: 'flavour', op: store.productOption.flavour, buttonText: 'รสชาติ' }
        //     // ];
        // }));

        const optionData = computed(() => {
            return [
                { label: 'Dashboard', buttonText: 'กลุ่ม' },
                { label: 'Settings',  buttonText: 'ยี่ห้อ' },
                { label: 'Earnings',  buttonText: 'ขนาด' },
                { label: 'Sign out',  buttonText: 'รสชาติ' }
            ];
        });

        onMounted(() => {
            store.getProduct()
            store.getDataOpion()
        });

        return {
            products,
            tableColumns,
            handleClick,
            optionData
        }
    }
}
</script>
