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

      <discrete-distribution-analysis v-if="randoms.length" :name="name" :data="randoms" />
    </q-form>
  </q-page>
</template>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    toRefs,
  } from '@vue/composition-api';

  import DiscreteDistributionAnalysis from 'components/DiscreteDistributionAnalysis.vue';

  function usePoissonDistributionGenerator() {
    const state = reactive({
      name: 'Poisson',
      randoms: [] as number[],
      rate: 6,
      n: 3250,

      stage: 'generation',

      base64: '',
      generate: () => {
        const { rate, n } = state;

        const randoms = [];
        let i = 0;

        const a = Math.E ** (-rate);

        while (i < n) {
          let p = 1;
          let x = -1;

          do {
            const r = Math.random();
            p *= r;
            x++;
          } while (p >= a);

          randoms.push(x);
          i++;
        }

        state.randoms = randoms;
      },
      onSubmit: () => {
        if (state.stage === 'generation') {
          state.generate();
          state.stage = 'validation';
        }
        state.base64 = `data:text/plain;charset=utf-8,${encodeURIComponent(state.randoms.join(','))}`;
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
    name: 'PoissonDistributionGenerator',
    components: { DiscreteDistributionAnalysis },
    setup() {
      return usePoissonDistributionGenerator();
    },
  });
</script>
