export default defineNuxtPlugin(app=> {app.hook('app:mounted',()=>{document.documentElement.dataset.appReady='true'})})
