<!-- Главная (макет 1.01) -->
<script setup lang="ts">
definePageMeta({ layout: 'public' })
useHead({ title: 'Поддержка, в которой ничего не теряется' })

const steps = [
  { title: 'Создайте заявку', text: 'Клиент или оператор описывает проблему в одной форме.' },
  { title: 'Назначьте исполнителя', text: 'Оператор выбирает ответственного и приоритет.' },
  { title: 'Подтвердите решение', text: 'Клиент получает результат и закрывает заявку.' },
]

const features = [
  { title: 'Все обращения рядом', text: 'Статусы, приоритеты и история общения.' },
  { title: 'Понятная ответственность', text: 'У каждой заявки есть исполнитель.' },
  { title: 'Контроль сроков', text: 'Сроки реакции и решения всегда на виду.' },
]

const faq = [
  {
    q: 'Нужен ли backend, чтобы попробовать WorkFlow?',
    a: 'Нет. На первом этапе приложение работает на локальных демо-данных.',
  },
  {
    q: 'Можно ли работать с клавиатуры?',
    a: 'Да: меню, фильтры и модальные окна доступны через Tab, стрелки и Esc.',
  },
]
</script>

<template>
  <div>
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero__content">
        <p class="hero__eyebrow">Заявки · команда · результат</p>
        <h1 id="hero-title" class="hero__title">Поддержка, в&nbsp;которой ничего не теряется</h1>
        <p class="hero__text">
          От первого обращения до решения — управляйте заявками, назначайте исполнителей и держите сроки под
          контролем.
        </p>
        <UiButton to="/login">Начать работу</UiButton>
      </div>
      <div class="hero__mark">
        <BrandMark />
      </div>
    </section>

    <section id="steps" class="container section" aria-label="Как это работает">
      <ol class="steps">
        <li v-for="(step, index) in steps" :key="step.title" class="steps__item panel">
          <span class="steps__num">0{{ index + 1 }}</span>
          <span>
            <strong class="steps__title">{{ step.title }}</strong>
            <span class="steps__text">{{ step.text }}</span>
          </span>
        </li>
      </ol>
    </section>

    <section id="features" class="container section" aria-labelledby="features-title">
      <h2 id="features-title" class="section__title">Одна система для всей команды</h2>
      <ul class="features">
        <li v-for="feature in features" :key="feature.title" class="features__item panel">
          <h3 class="features__title">{{ feature.title }}</h3>
          <p class="features__text">{{ feature.text }}</p>
        </li>
      </ul>
    </section>

    <section id="faq" class="container section" aria-labelledby="faq-title">
      <h2 id="faq-title" class="section__title">Частые вопросы</h2>
      <div class="faq">
        <details v-for="item in faq" :key="item.q" class="faq__item panel">
          <summary class="faq__question">{{ item.q }}</summary>
          <p class="faq__answer">{{ item.a }}</p>
        </details>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  align-items: center;
  gap: 32px;
  padding-block: 40px 48px;
}

.hero__eyebrow {
  margin-bottom: 16px;
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

.hero__title {
  max-width: 13ch;
  margin-bottom: 16px;
  font-size: var(--fs-hero);
  line-height: 1.15;
}

.hero__text {
  max-width: 44ch;
  margin-bottom: 24px;
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.hero__mark {
  width: min(220px, 60%);
  margin-inline: auto;
}

.section {
  padding-block: 24px;
}

.section__title {
  margin-bottom: 20px;
  font-size: var(--fs-xl);
}

.steps {
  display: grid;
  gap: 12px;
}

.steps__item {
  display: flex;
  gap: 12px;
  padding: 16px;
  font-size: var(--fs-sm);
}

.steps__num {
  font-weight: 600;
  color: var(--c-cyan);
}

.steps__title {
  display: block;
  font-weight: 600;
}

.steps__text {
  display: block;
  margin-top: 4px;
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.features {
  display: grid;
  gap: 12px;
}

.features__item {
  padding: 20px;
}

.features__title {
  margin-bottom: 8px;
  font-size: var(--fs-md);
  font-weight: 600;
}

.features__text {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.faq {
  display: grid;
  gap: 12px;
  margin-bottom: 40px;
}

.faq__item {
  padding: 0;
  transition: border-color var(--transition);
}

.faq__item:hover {
  border-color: var(--c-border-strong);
}

.faq__question {
  padding: 16px 20px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-lg);
}

.faq__answer {
  padding: 0 20px 16px;
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

@media (min-width: 768px) {
  .hero {
    grid-template-columns: 1.4fr 1fr;
    padding-block: 64px;
  }

  .hero__mark {
    width: min(260px, 100%);
  }

  .steps,
  .features {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .steps__text {
    display: none;
  }
}

@media (min-width: 1280px) {
  .hero {
    padding-block: 80px 72px;
  }

  .section {
    padding-block: 32px;
  }

  .steps__text {
    display: block;
  }
}
</style>
