<!-- Восьмиугольный знак Octagon, разделённый на две половины. -->
<template>
  <svg class="mark" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="mark-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6ae0ef" />
        <stop offset="1" stop-color="#3a9fd0" />
      </linearGradient>
      <linearGradient id="mark-bottom" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8f5cff" />
        <stop offset="1" stop-color="#c84bc4" />
      </linearGradient>
    </defs>
    <path d="M62 14h76l48 48v22h-38v-4l-26-26H78L52 80v4H14V62z" fill="url(#mark-top)" />
    <path d="M14 116h38v4l26 26h44l26-26v-4h38v22l-48 48H62l-48-48z" fill="url(#mark-bottom)" />
  </svg>
</template>

<style scoped>
.mark {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 18px 40px rgba(122, 92, 255, 0.35));
}
</style>
