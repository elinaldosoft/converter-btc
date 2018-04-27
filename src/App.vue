<template>
  <div id="app">
	  <div class="container btc-top">
			<div class="row" style="margin-bottom: 150px;">
				<div class="col">
					<app-buy></app-buy>
				</div>
				<div class="col">
					<app-sell></app-sell>
				</div>
			</div>
	  </div>
  </div>
</template>
<script>
import AppBuy from './components/AppBuy.vue'
import AppSell from './components/AppSell.vue'
export default {
  name: 'app',
  components: { AppBuy, AppSell },
}
</script>
<style lang="scss" scoped>
@import './scss/style.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>