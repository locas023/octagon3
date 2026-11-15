<script setup lang="ts">
onMounted(async()=>{await $fetch('/api/auth/logout',{method:'POST'});clearNuxtData();await navigateTo('/login')})
</script>
<template><p class="container page" role="status">Завершаем сеанс…</p></template>
