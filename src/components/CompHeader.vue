<template>
    <header class="flex justify-between max-w-300 mt-5 ml-20 text-2xl">
        <!-- Ссылки  -->
        <p>Ritm</p>
        <div>
            <router-link to="/logout">Вход</router-link>
        </div>
        <div>
            <p>Привычки</p>
        </div>
        <div>
            <p>Статистика</p>
        </div>
        <div>
            <p>Календарь</p>
        </div>
        <div>
            <p>Награды</p>
        </div>
        <div>
            <p>Прфиль</p>
        </div>
        <div>
            <p>Настройки</p>
        </div>
        <div class="flex justify-end">
            <div>
                <div class="w-20 h-8 bg-fuchsia-900 mr-10 rounded-4xl ">огонек</div>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-600 mb-10">

            </div>
        </div>
    </header>
</template>

<script setup lang='ts'>
</script>
