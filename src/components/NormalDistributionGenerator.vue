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
        v-model.number="mean"
        label="Mu *"
        type="text"
        filled
        lazy-rules
        :rules="[
          val => typeof val === 'number' || 'Requerido'
        ]"
      />

      <q-input
        v-model.number="std"
        label="Sigma *"
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

  function useNormalDistributionGenerator() {
    const state = reactive({
      name: 'Normal',
      randoms: [] as number[],
      mean: 30,
      std: 9.6,
      n: 5600,

      stage: 'generation',

      base64: '',
      generate: () => {
        const { mean, std, n } = state;

        const randoms = [];
        let i = 0;

        while (i < n) {
          const r1 = Math.random();
          const r2 = Math.random();

          const random = Math.sqrt(-2 * Math.log(1 - r1)) * Math.cos(2 * Math.PI * r2);
          const unnormalizedRandom = mean + random * std;
          randoms.push(unnormalizedRandom);

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

        state.mean = 0;
        state.std = 0;
        state.n = 0;
      },
    });

    return toRefs(state);
  }

  export default defineComponent({
    name: 'NormalDistributionGenerator',
    components: { DistributionAnalysis },
    setup() {
      return useNormalDistributionGenerator();
    },
  });
</script>
