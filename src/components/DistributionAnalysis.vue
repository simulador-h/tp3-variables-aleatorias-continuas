<template>
  <q-page padding>
    <q-form
      class="q-gutter-md"
      @submit.prevent="onSubmit"
    >
      <div class="row q-gutter-xl items-start">
        <q-input
          v-model.number="analysisParameters.intervals"
          label="Cantidad de Intervalos *"
          type="text"
          filled
          lazy-rules
          :rules="[ val => val ]"
        />

        <q-input
          v-model.number="analysisParameters.confidenceLevel"
          label="Nivel de Confianza *"
          type="text"
          filled
          lazy-rules
          :rules="[ val => (val && val > 0 && val < 1) || 'Requerido | [0-1]' ]"
        />
        <q-btn label="Validar" type="submit" color="secondary" fab />
      </div>
    </q-form>

    <div v-if="probabilityDistributions.length" class="row q-col-gutter-xl">
      <div class="col-xs-12 col-md-8">
        <bar-chart :data="chartData" :options="chartOptions" />
      </div>

      <div class="col-xs-12 col-md-4">
        <q-list bordered separator>
          <q-item
            v-for="distribution in probabilityDistributions"
            :key="distribution.name"
            v-ripple clickable
            :active="fittestProbabilityDistribution.name === distribution.name" active-class="text-positive"
            @click="updateChart(distribution)"
          >
            <q-item-section>
              <q-item-label lines="1">
                {{ distribution.name }}
              </q-item-label>
              <q-item-label v-if="distribution.chiSquared" caption>
                χ² | {{ distribution.chiSquared.statistic.toFixed(3) }}
              </q-item-label>
            </q-item-section>
            <q-item-section v-if="distribution.chiSquared" side>
              <q-icon
                v-if="distribution.chiSquared.statistic < distribution.chiSquared.critical"
                name="check_circle"
                color="positive"
              />
              <q-icon v-else name="warning" color="grey" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
  .q-list {
   display: flex;
   flex-direction: column;
   height: 100%;

   .q-item {
     flex-grow: 1;
   }
 }
</style>

<script lang="ts">
  import { defineComponent, reactive, toRefs, PropType } from '@vue/composition-api';

  import { jStat } from 'jstat';

  import { IStatisticProperties, IProbabilityDistribution, IAnalysisParameters } from 'interfaces';

  import BarChart from 'components/BarChart.vue';

  function useDistributionAnalysis(props: { name: string, data: number[] }) {
    const state = reactive({
      dataValues: props.data,
      statisticProperties: {} as IStatisticProperties,
      analysisParameters: {
        intervals: Math.trunc(
          Math.sqrt(props.data.length),
        ),
        confidenceLevel: 0.95,
      } as IAnalysisParameters,
      observedFrequencies: [] as number[],
      observedProbabilities: [] as number[],
      probabilityDistributions: [] as IProbabilityDistribution[],
      fittestProbabilityDistribution: {} as IProbabilityDistribution,
      chartData: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: props.name,
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },

      defineStatisticProperties() {
        const n = state.dataValues.length;

        const min = Math.min(...state.dataValues);
        const max = Math.max(...state.dataValues);

        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        /* eslint-disable @typescript-eslint/no-unsafe-call */
        const mean = jStat.mean(state.dataValues);
        const variance = jStat.variance(state.dataValues);
        const std = jStat.stdev(state.dataValues);

        const rate = 1 / mean;

        state.statisticProperties = {
          n, min, max, mean, variance, std, rate,
        };
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        /* eslint-enable @typescript-eslint/no-unsafe-member-access */
        /* eslint-enable @typescript-eslint/no-unsafe-call */
      },

      defineAnalysisParameters() {
        const { intervals, confidenceLevel } = state.analysisParameters;
        const { min, max } = state.statisticProperties;

        // const intervals = Math.trunc(
        //   Math.sqrt(n),
        // );

        const step = (max - min) / intervals;

        const bounds = new Array(intervals)
          .fill(undefined)
          .map((_v, idx) => [
            min + step * (idx),
            min + step * (idx + 1),
          ]);

        state.analysisParameters = {
          intervals, step, bounds, confidenceLevel,
        };
      },

      analyseData() {
        const { n, min, max, mean, std, rate } = state.statisticProperties;
        const { intervals, bounds } = state.analysisParameters;

        const uniformProbabilities = [];
        const normalProbabilities = [];
        const exponentialProbabilities = [];

        const observedFrequencies = [];

        for (let i = 0; i < intervals; i++) {
          const [lowerBound, upperBound] = bounds[i];

          /* eslint-disable @typescript-eslint/no-unsafe-member-access */
          /* eslint-disable @typescript-eslint/no-unsafe-call */
          const uP = jStat.uniform.cdf(upperBound, min, max) - jStat.uniform.cdf(lowerBound, min, max);
          uniformProbabilities.push(uP);

          const nP = jStat.normal.cdf(upperBound, mean, std) - jStat.normal.cdf(lowerBound, mean, std);
          normalProbabilities.push(nP);

          const eP = jStat.exponential.cdf(upperBound, rate) - jStat.exponential.cdf(lowerBound, rate);
          exponentialProbabilities.push(eP);
          /* eslint-enable @typescript-eslint/no-unsafe-member-access */
          /* eslint-enable @typescript-eslint/no-unsafe-call */

          const obsF = state.dataValues.reduce(
            (f, v) => ((i === intervals - 1 && v >= lowerBound) || (v >= lowerBound && v < upperBound) ? f + 1 : f), 0,
          );
          observedFrequencies.push(obsF);
        }

        state.observedFrequencies = observedFrequencies;
        state.observedProbabilities = observedFrequencies.map((f) => f / n);

        state.probabilityDistributions = [{
          name: 'Uniforme',
          expectedProbabilities: uniformProbabilities,
          expectedFrequencies: uniformProbabilities.map((p) => p * n),
        }, {
          name: 'Normal',
          expectedProbabilities: normalProbabilities,
          expectedFrequencies: normalProbabilities.map((p) => p * n),
        }, {
          name: 'Exponencial',
          expectedProbabilities: exponentialProbabilities,
          expectedFrequencies: exponentialProbabilities.map((p) => p * n),
        }] as IProbabilityDistribution[];
      },

      calculateStatistics(probabilityDistribution: IProbabilityDistribution) {
        const { n } = state.statisticProperties;

        const {
          observedFrequencies,
          observedProbabilities,
          analysisParameters: { intervals, confidenceLevel },
        } = state;

        const {
          expectedFrequencies,
          expectedProbabilities,
        } = probabilityDistribution;

        let csStatistic = 0;
        let ksStatistic = 0;

        for (let i = 0; i < intervals; i++) {
          const expF = expectedFrequencies[i];
          const obsF = observedFrequencies[i];

          csStatistic += ((expF - obsF) ** 2) / expF;

          const accumulatedExpectedProbabilities = expectedProbabilities.slice(0, i + 1).reduce((acP, p) => acP + p, 0);
          const accumulatedObservedProbabilities = observedProbabilities.slice(0, i + 1).reduce((acP, p) => acP + p, 0);
          const ks = Math.abs(accumulatedObservedProbabilities - accumulatedExpectedProbabilities);

          ksStatistic = Math.max(ks, ksStatistic);
        }

        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        /* eslint-disable @typescript-eslint/no-unsafe-call */
        const csProbability = 1 - jStat.chisquare.cdf(csStatistic, intervals - 1);
        const csCritical = jStat.chisquare.inv(confidenceLevel, intervals - 1);

        probabilityDistribution.chiSquared = {
          statistic: csStatistic,
          probability: csProbability,
          critical: csCritical,
        };

        probabilityDistribution.kolmogorovSmirnov = {
          statistic: ksStatistic,
          rejected: ksStatistic >= (1.36 / Math.sqrt(n)),
        };
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        /* eslint-enable @typescript-eslint/no-unsafe-member-access */
        /* eslint-enable @typescript-eslint/no-unsafe-call */
      },

      updateChart(probabilityDistribution: IProbabilityDistribution) {
        state.chartData = {
          labels: state.analysisParameters.bounds.map(
            ([lowerBound, upperBound]) => {
              const midValue = (upperBound + lowerBound) / 2;
              return midValue.toFixed(2);
            },
          ),
          datasets: [{
            label: 'Frecuencias Esperadas',
            data: probabilityDistribution.expectedFrequencies.map((expF) => expF.toFixed(2)),
            borderWidth: 1,
            borderColor: 'rgb(144 147 153)',
            backgroundColor: 'rgba(144 147 153 / 60%)',
            hoverBorderColor: 'rgb(230 162 60)',
            hoverBackgroundColor: 'rgba(230 162 60 / 60%)',
          }, {
            label: 'Frecuencias Observadas',
            data: state.observedFrequencies,
            borderWidth: 1,
            borderColor: 'rgb(103 194 58)',
            backgroundColor: 'rgba(103 194 58 / 60%)',
            hoverBorderColor: 'rgb(245 108 108)',
            hoverBackgroundColor: 'rgba(245 108 108 / 60%)',
          }],
        };
      },

      onSubmit() {
        state.defineStatisticProperties();
        state.defineAnalysisParameters();
        state.analyseData();

        state.probabilityDistributions.forEach(
          (probabilityDistribution: IProbabilityDistribution) => {
            state.calculateStatistics(probabilityDistribution);
          },
        );

        state.fittestProbabilityDistribution = state.probabilityDistributions.reduce(
          (bestFit, probabilityDistribution) => (
            ((bestFit.chiSquared?.probability || 0) < (probabilityDistribution.chiSquared?.probability || 0))
              ? probabilityDistribution
              : bestFit
          ), state.probabilityDistributions[0],
        );

        state.updateChart(state.fittestProbabilityDistribution);
      },
    });

    return toRefs(state);
  }

  export default defineComponent({
    name: 'DistributionAnalysis',
    components: { BarChart },
    props: {
      name: {
        required: true,
        type: String,
      },
      data: {
        required: true,
        type: Array as PropType<number[]>,
      },
    },
    setup(props) {
      return useDistributionAnalysis(props);
    },
  });
</script>
