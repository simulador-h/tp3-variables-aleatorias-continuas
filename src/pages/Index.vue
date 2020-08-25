<template>
  <q-page class="column items-center justify-evenly">
    <h1>
      GRUPO - H
    </h1>
    <h3>
      Generación de Variables Aleatorias
    </h3>
    <div class="row q-gutter-md justify-center">
      <q-btn push color="white" text-color="primary" label="Lucas Astrada" />
      <q-btn push color="white" text-color="primary" label="Tatiana Candusso" />
      <q-btn push color="white" text-color="primary" label="Rodrigo Gonzalez" />
      <q-btn push color="white" text-color="primary" label="Enzo Montoya" />
      <q-btn push color="white" text-color="primary" label="Gabriel Palacio" />
    </div>
  </q-page>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api';

  export default defineComponent({
    name: 'PageIndex',
    components: { },
    setup() {
      return { };
    },
  });
</script>
