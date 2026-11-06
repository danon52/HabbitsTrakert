<template>
    <CompHeader />


    <div class="flex justify-between p-5">
        <div>
            <p class="text-5xl">Привычки </p>
            <p class="text-[#9C9488]">Цвет помогает отличить их ещё до названия.</p>
        </div>
        <div>
            <!-- рабочая кнопка -->
            <button class="bg-[#5C4C72] w-45 h-10 rounded-2xl cursor-pointer ">+ Новая првычка </button>
        </div>
    </div>
    <div class="px-10">
        <div class="w-full rounded-4xl h-60 bg-[#2F2B26]">
            <div>
                <p class=" px-5 text-2xl py-4 ">Новая привычка </p>
                <div>
                    <p class="ml-20 text-[#9C9488]">Название </p>
                </div>
            </div>
            <form action="">
                <div class="ml-20">
                    <input class="px-5 rounded-xl bg-[#100E0C] w-150 h-10 border  border-[#8d8174]"
                        placeholder="Введите название новой привычки " type="text">
                </div>
                <div>
                    <label for="Mn">
                        <input class="" id="Mn" placeholder="" type="checkbox">
                        Пн</label>
                </div>
            </form>
        </div>

    </div>
</template>


<script setup lang='ts'>
import CompHeader from './components/CompHeader.vue';



// сделать функци добовления новой привычки 

</script>
