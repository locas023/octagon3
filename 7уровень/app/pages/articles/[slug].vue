<script setup lang="ts">
definePageMeta({layout:'public'})
const route=useRoute()
const article=ARTICLES.find(item=>item.slug===route.params.slug)
if(!article) throw createError({statusCode:404,statusMessage:'Статья не найдена'})
usePublicSeo(article.title,article.intro)
const vote=ref('')
</script>
<template><article v-if="article" class="container knowledge"><h1>{{article.title}}</h1><p class="muted">{{article.category}} · Обновлено 5 октября 2026</p><section class="panel knowledge-card"><h2>Перед началом</h2><p>{{article.intro}}</p><template v-for="(step,index) in article.steps" :key="index"><h2>{{index+1}}. {{step[0]}}</h2><p>{{step[1]}}</p></template><h3>Была ли статья полезна?</h3><div><button v-for="answer in ['Да','Нет']" :key="answer" :aria-pressed="vote===answer" @click="vote=answer">{{answer}}</button></div><p v-if="vote" role="status">Спасибо за отзыв</p></section></article></template>
