<template>
    <!-- общий див(сетка) -->
    <div class="grid grid-cols-2  gap-4">
        <!-- Текст к входу -->
        <div class="bg-[#191714] flex h-screen w-full items-center justify-center  ">
            <div>

                <div>
                    <p class="text-6xl max-w-150">Отметили — и день на месте.</p>
                </div>
                <div>
                    <p class="text-xl text-[#9C9488] max-w-150">Серии, год клетками и тихие бонусы. Без ленты и без
                        сравнения с
                        другими. </p>
                </div>
                <div class="text-[#F3EEE6]">
                    <div>
                        <p>— Привычка со своим цветом и временем</p>
                    </div>
                    <div>
                        <p>— День закрывается, когда отмечено своё</p>
                    </div>
                    <div>
                        <p>— Огоньки копятся и тратятся на передышку</p>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="flex h-screen w-full items-center justify-center ">

                <form class=" w-100 h-80" action="">
                    <div>
                        <p class="text-4xl">Вход</p>
                    </div>
                    <div>
                        <div>
                            <p class="text-gray-400"> Почта и пароль. Серия некуда не денеться </p>
                        </div>
                    </div>
                    <div class="mt-5">
                        <p class="">Почта</p>
                        <input class="border w-90 h-10 rounded-xl bg-[#100E0C]" type="email">
                    </div>
                    <div>
                        <div class="mt-5">
                            <p>Пароль</p>
                            <input class="border w-90 h-10 rounded-xl bg-[#100E0C]" type="password" name="" id="">
                        </div>
                    </div>
                    <div class="mt-5 ">
                        <button class="w-90  h-10 rounded-2xl bg-[#5C4C72]">Войти</button>
                    </div>
                    <div>
                        <router-link to="/">
                            <p class="text-[#A898C4] mt-2 ml-1">Нет аккаунта - регистрация</p>
                        </router-link>
                    </div>
                    <div>
                        <router-link to="/">
                            <p class="text-gray-400 mt-2 ml-1">Забыли пароль</p>
                        </router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'></script>