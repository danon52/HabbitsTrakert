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
                <div class="w-15 h-15 border rounded-full ml-5">
                    <p class="p-4 ml-0.5">30</p>
                </div>
                <div>
                    <p class="px-3 text-xl"> Месяц силы </p>
                    <div>
                        <p class="text-[#9C9488] px-3">осталось 18 дней </p>
                    </div>
                </div>
            </div>
            <div class="w-[400px] h-3 border bg-[#2F2B26] rounded-3xl ml-6 mt-5 dark:bg-[##2F2B26]">
                <div class="bg-[#7E9A84] h-2.5 rounded-3xl" style="width: 60%;"></div>
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