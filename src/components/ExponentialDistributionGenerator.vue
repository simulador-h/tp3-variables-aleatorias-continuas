<template>
  <q-page padding>
    <q-form
      class="q-gutter-md"
      @submit.prevent="onSubmit"
      @reset="onReset"
    >
      <q-input
        v-model.number="n"
        label="Cantidad *"
        filled
        lazy-rules
        :rules="[ val => (val && val > 0) || 'Requerido | Mayor a 0' ]"
      />

      <q-input
        v-model.number="rate"
        label="Lambda *"
        type="text"
        filled
        lazy-rules
        :rules="[ val => (val && val > 0) || 'Requerido | Mayor a 0' ]"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" :disabled="stage !== 'generation'" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />

        <q-btn
          v-if="randoms.length"
          type="a" :href="base64" download
          class="float-right" label="Descargar Serie" color="accent"
        />
      </div>

      <distribution-analysis v-if="randoms.length" :name="name" :data="randoms" />
    </q-form>
  </q-page>
</template>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    toRefs,
  } from '@vue/composition-api';

  import DistributionAnalysis from 'components/DistributionAnalysis.vue';

  function useExponentialDistributionGenerator() {
    const state = reactive({
      name: 'Exponencial',
      randoms: [] as number[],
      rate: 0.32,
      n: 4500,

      stage: 'generation',

      base64: '',
      generate: () => {
        const { rate, n } = state;

        const randoms = [];
        let i = 0;

        while (i < n) {
          const r = Math.random();

          const random = (-1 / rate) * Math.log(1 - r);
          randoms.push(random);

          i++;
        }

        state.randoms = randoms;
      },
      onSubmit: () => {
        if (state.stage === 'generation') {
          state.generate();
          state.stage = 'validation';
        }
        state.base64 = `data:text/csv;charset=utf-8,${
          encodeURIComponent(state.randoms.map((r) => `"${r.toString().replace('.', ',')}"`).join('\n'))
        }`;
      },
      onReset: () => {
        state.stage = 'generation';
        state.randoms = [];

        state.rate = 0;
        state.n = 0;
      },
    });

    return toRefs(state);
  }

  export default defineComponent({
    name: 'ExponentialDistributionGenerator',
    components: { DistributionAnalysis },
    setup() {
      return useExponentialDistributionGenerator();
    },
  });
</script>
