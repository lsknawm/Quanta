<template>
  <div class="card">
    <Header :meta="question.meta" />

    <div class="content">
      <div v-html="question.content.text"></div>
      <div v-for="asset in question.content.assets">
        <img v-if="asset.type === 'image'" :src="asset.src" />
        <CodeBlock v-if="asset.type === 'code'" :code="asset.value" />
      </div>
    </div>

    <component
      :is="getComponentByType(question.type)"
      :structure="question.structure"
      v-model="userResponse"
      :disabled="hasSubmitted"
    />

    <Footer
      v-if="hasSubmitted"
      :userResponse="userResponse"
      :validation="question.validation"
    />
  </div>
</template>
