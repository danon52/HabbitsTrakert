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
    </div>
</template>

<script setup lang='ts'>
import CompHeader from './components/CompHeader.vue';

</script>