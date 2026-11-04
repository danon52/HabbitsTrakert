<template>
    <CompHeader />
    <div class="p-10">
        <div>
            <!-- оживить календарь -->
            <p class="text-2xl text-[#C4A574]"> Воскресенье , 11 октября </p>
        </div>
        <div>
            <p class="text-4xl py-3">Доброе утро ,Данил</p>
        </div>
        <div>
            <p class="text-[#9C9488]">Вы на 12-м дне серии. Чтобы закрыть день, осталось две привычки.</p>
        </div>
        <div class="flex justify-between mt-10">
            <!-- оживить дни недели  -->
            <div class="w-50 h-20 rounded-3xl bg-[#2F2B26] border  border-[#3A342E]">
                <p class="text-center">
                    пн
                </p>
                <div class="text-center">
                    <p class="text-2xl">5</p>
                    <div class="flex justify-center">
                        <p class="w-2 h-2 rounded-full bg-[#3A342E] text-center"></p>
                    </div>
                </div>

            </div>
            <div class="w-50 h-20 rounded-3xl bg-[#2F2B26] border  border-[#3A342E]">
                <p class="text-center">
                    вт
                </p>
                <div class="text-center">
                    <p class="text-2xl">6</p>
                    <div class="flex justify-center">
                        <p class="w-2 h-2 rounded-full bg-[#3A342E] text-center"></p>
                    </div>
                </div>
            </div>
            <div class="w-50 h-20 rounded-3xl bg-[#2F2B26] border  border-[#3A342E]">
                <p class="text-center">
                    ср
                </p>
                <div class="text-center">
                    <p class="text-2xl">7</p>
                    <div class="flex justify-center">
                        <p class="w-2 h-2 rounded-full bg-[#3A342E] text-center"></p>
                    </div>
                </div>
            </div>
            <div class="w-50 h-20 rounded-3xl bg-[#2F2B26] border  border-[#3A342E]">
                <p class="text-center">
                    чт
                </p>
                <div class="text-center">
                    <p class="text-2xl">8</p>
                    <div class="flex justify-center">
                        <p class="w-2 h-2 rounded-full bg-[#3A342E] text-center"></p>
                    </div>
                </div>
            </div>
            <div class="w-50 h-20 rounded-3xl bg-[#2F2B26] border  border-[#3A342E]">
                <p class="text-center">
                    пт
                </p>
                <div class="text-center">
                    <p class="text-2xl">9</p>
                    <div class="flex justify-center">
                        <p class="w-2 h-2 rounded-full bg-[#3A342E] text-center"></p>
                    </div>
                </div>
            </div>
            <div class="w-50 h-20 rounded-3xl text-black  bg-[#D7E4DC] border  border-[#3A342E]">
                <p class="text-center">
                    сб
                </p>
                <div class="text-center">
                    <p class="text-2xl">10</p>
                    <div class="flex justify-center">
                        <p class="w-2 h-2 rounded-full bg-[#3A342E] text-center"></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- испраить календарь  -->
        <!-- <div class="p-4">
            <CalendarHeatmap :end-date="new Date()" :values="heatmapData" />
        </div> -->
    </div>
    <!-- расчет коофицента выполненых  -->

    <div class="flex">
        <div class="w-[500px] h-[150px] bg-[#2F2B26] rounded-4xl ml-10">
            <div class="px-4 py-3">
                <p class="text-[#9C9488] text-xs">Ближайшие награды</p>
            </div>
            <div class="flex">
                <div class="w-15 h-15 border-2 border-[#C4A574] rounded-full ml-4.5">
                    <p class="p-4 ml-0.5 text-[#C4A574] font-bold ">30</p>
                </div>
                <div>
                    <p class="px-3 text-xl"> Месяц силы </p>
                    <div>
                        <p class="text-[#9C9488] px-3">осталось 18 дней </p>
                    </div>
                </div>
            </div>
            <div class="w-[400px] h-3  bg-[#2F2B26] rounded-3xl ml-6 mt-5 dark:bg-[#211f1c]">
                <div class="bg-[#7E9A84] h-3 rounded-3xl" style="width: 60%;"></div>
            </div>
        </div>
        <div>
            <div class="w-[500px] h-[150px]  bg-[#2F2B26] rounded-4xl ml-10">
                <div class="px-4 py-3">
                    <p class="text-[#9C9488] text-xs">Эта неделя </p>
                </div>
                <div class="grid grid-cols-3 gap-10">
                    <div>
                        <!-- сделать динамичным  -->
                        <p class="text-3xl text-[#7E9A84] ml-15">86% </p>
                        <div class="ml-15">
                            <p class="text-[#9C9488] text-xs">Выполнено</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-3xl px-3">12</p>
                        <div cla>
                            <p class="text-xs text-[#9C9488]">дней серии </p>
                        </div>
                    </div>
                    <div>
                        <p class="text-3xl px-3 text-[#C4A574]">2</p>
                        <div>
                            <p class="text-[#9C9488] text-xs">награды</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div>
            <div class="w-[500px] h-[150px]  bg-[#241C16] rounded-4xl ml-10">
                <div>
                    <p class="text-[#9C9488] p-5 text-xs">Огоньки</p>
                </div>
                <div>
                    <p class="text-4xl ml-5 text-[#C4A574]">240</p>
                </div>
                <div class="text-[#9C9488] text-end mr-10">
                    <p>за сегодня +1</p>
                </div>
            </div>
        </div>
    </div>
    <!-- при выборе меняется цвет  -->
    <div class="py-10 flex justify-between ">
        <div>
            <p class="text-xl">Привычки на сегодня </p>
        </div>
        <div class="flex mr-10">
            <div class="w-20 h-10 bg-[#5C4C72] rounded-4xl mr-5">
                <p class="text-xl py-1 px-5.5">Все</p>
            </div>
            <div class="w-20 h-10 border border-[#2F2B26] rounded-4xl">
                <p class="text-xl py-1 px-4">Утро</p>
            </div>
            <div class="w-20 h-10 border border-[#2F2B26] rounded-4xl mr-5 ml-5 ">
                <p class="text-xl py-1 px-4">День</p>
            </div>
            <div class="w-20 h-10 border border-[#2F2B26] rounded-4xl">
                <p class="text-xl py-1 px-3">Вечер</p>
            </div>
        </div>
    </div>



    <!-- блок с задачами должен доставаться из бд -->
    <!-- блок с задачами  -->
    <div class="grid grid-cols-3 gap-4 ml-10">
        <div class="w-100 h-40 bg-[#2F2B26] rounded-3xl ">
            <div class="p-5 flex justify-between">
                <div>
                    <div class="w-10 h-10 rounded-2xl  bg-[#9A8FBF] ">
                    </div>
                    <div>
                        <p class="text-xl">Зарядка</p>
                    </div>
                    <div class="py-2 flex ">
                        <p class="text-xs text-[#9C9488]">Каждый день, </p>
                        <div class=" ml-2">
                            <p class="text-xs text-[#9C9488]">7:30 </p>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#9A8FBF]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#9A8FBF]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#9A8FBF]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#9A8FBF]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#9A8FBF]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#9A8FBF]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#9A8FBF]">
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <input type="checkbox" class="w-5 h-5 rounded-full">
                </div>
            </div>
        </div>
        <div class="w-100 h-40 bg-[#2F2B26] rounded-3xl ">
            <div class="p-5 flex justify-between">
                <div>
                    <div class="w-10 h-10 rounded-2xl  bg-[#7EA4BE] ">
                    </div>
                    <div class="py-2  ">
                        <p class="text-xl">Вода </p>
                        <div class="py-1 ">
                            <p class="text-xs text-[#9C9488]">5 из 8 стаканов</p>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#7EA4BE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#7EA4BE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#7EA4BE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#7EA4BE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#7EA4BE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#7EA4BE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5 bg-[#7EA4BE]">
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <input type="checkbox" class="w-5 h-5 rounded-full">
                </div>
            </div>
        </div>
        <div class="w-100 h-40 bg-[#2F2B26] rounded-3xl ">
            <div class="p-5 flex justify-between">
                <div>
                    <div class="w-10 h-10 rounded-2xl  bg-[#C6A56A] ">
                    </div>
                    <div class="py-2 ">
                        <p class="text-xl">Чтение </p>
                        <div class="py-1 ">
                            <p class="text-xs text-[#9C9488]">30 минут, 21:00 </p>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#C6A56A]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#C6A56A]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#C6A56A]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#C6A56A]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#C6A56A]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#C6A56A]">
                        </div>
                        <div class="w-3 h-3 rounded-full  m-0.5 bg-[#C6A56A]">
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <input type="checkbox" class="w-5 h-5 rounded-full">
                </div>
            </div>
        </div>
        <div class="w-100 h-40 bg-[#2F2B26] rounded-3xl ">
            <div class="p-5 flex justify-between">
                <div>
                    <div class="w-10 h-10 rounded-2xl  bg-[#B7A8D4] ">
                    </div>
                    <div class="py-2 ">
                        <p class="text-xl">Медетация </p>
                        <div class="py-1 ">
                            <p class="text-xs text-[#9C9488]">10 минут, 08:00 </p>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#B7A8D4]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#B7A8D4]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#B7A8D4]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#B7A8D4]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#B7A8D4]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#B7A8D4]">
                        </div>
                        <div class="w-3 h-3 rounded-full  m-0.5 bg-[#B7A8D4]">
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <input type="checkbox" class="w-5 h-5 rounded-full">
                </div>
            </div>
        </div>
        <div class="w-100 h-40 bg-[#2F2B26] rounded-3xl ">
            <div class="p-5 flex justify-between">
                <div>
                    <div class="w-10 h-10 rounded-2xl  bg-[#D4A3AE] ">
                    </div>
                    <div class="py-2 ">
                        <p class="text-xl">Английский </p>
                        <div class="py-1 ">
                            <p class="text-xs text-[#9C9488]">Пн, Ср, Пт, 19:00</p>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D4A3AE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D4A3AE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D4A3AE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D4A3AE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D4A3AE]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D4A3AE]">
                        </div>
                        <div class="w-3 h-3 rounded-full  m-0.5 bg-[#D4A3AE]">
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <input type="checkbox" class="w-5 h-5 rounded-full">
                </div>
            </div>
        </div>
        <div class="w-100 h-40 bg-[#2F2B26] rounded-3xl ">
            <div class="p-5 flex justify-between">
                <div>
                    <div class="w-10 h-10 rounded-2xl  bg-[#D09A7E] ">
                    </div>
                    <div class="py-2 ">
                        <p class="text-xl">Прогулка </p>
                        <div class="py-1 ">
                            <p class="text-xs text-[#9C9488]">Каждый день, 18:30 </p>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D09A7E]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D09A7E]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D09A7E]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D09A7E]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D09A7E]">
                        </div>
                        <div class="w-3 h-3 rounded-full m-0.5  bg-[#D09A7E]">
                        </div>
                        <div class="w-3 h-3 rounded-full  m-0.5 bg-[#D09A7E]">
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <input type="checkbox" class="w-5 h-5 rounded-full">
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang='ts'>
// import { ref } from 'vue';
// import CompHeader from './components/CompHeader.vue';
// const heatmapData = ref([
//     { date: '2026-01-15', count: 5 },
//     { date: '2026-01-16', count: 12 },
//     { date: '2026-02-01', count: 2 },
//     { date: '2026-10-25', count: 20 },
// ])
</script>