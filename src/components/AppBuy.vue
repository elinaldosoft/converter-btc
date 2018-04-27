<template>
<div class="content">
  <div class="card">
    <div class="card-header alert-success">
      COMPRAR tBTC
    </div>
    <div class="card-body">
    <form>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="for_price">Preço (1 BTC)</label>
          <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">R$</div>
            </div>
            <money :value="buy_price" v-model.lazy="buy_price" v-bind="money"></money>
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="for_quantity">Quantidade</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">BTC</div>
            </div>
            <money :value="buy_bit_coin" v-model.lazy="buy_bit_coin" v-bind="money" precision="8"></money>
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="for_quantity">Total</label>
          <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">R$</div>
            </div>
            <money :value="buy_total" v-model.lazy="buy_total" v-bind="money" precision="2"></money>
          </div>
        </div>
      </div>
    <table class="table">
      <tbody>
        <tr>
          <td align="left">Taxa 0.35%</td> 
          <td align="right" width="50%"><span>{{ buy_taxa }}</span></td>
        </tr>
        <tr>
          <td align="left">Valor da ordem</td> 
          <td align="right" width="50%"><span>{{ buy_total_taxa }}</span></td>
        </tr> 
        <tr>
          <td align="left">Posição no livro</td>
          <td align="right" width="50%"><span id="total_compra">{{ count }}</span></td>
        </tr>
      </tbody>
    </table>
      <hr/>
      <button v-on:click="buy" type="button" class="btn btn-outline-success btn-lg btn-block" data-target="#confirmBuy">Comprar</button>
      <!-- Modal -->
      <div class="modal fade" id="confirmBuy" tabindex="-1" role="dialog" aria-labelledby="confirmBuyLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmBuyLabel">Deseja confirmar sua ordem de compra?</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Você confirma sua ordem de compra em BRLtBTC <br/>
              Preço: <span id="mdPrice">R$ {{ buy_price }}</span> <br/>
              Quantidade: <span id="mdQuantity">BTC {{ buy_bit_coin.toFixed(8) }}</span> <br/>
              Taxa: <span id="mdTax">{{ this.buy_taxa }}</span> <br/>
              Total: <span id="mdAmount">{{ this.buy_total_taxa }}</span> <br/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Não</button>
              <button type="button" v-on:click="buyYes" class="btn btn-primary">Sim</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    </div>
  </div>
  <div class="card" style="margin-top:30px;">
    <div class="card-header alert-success">
        ORDENS DE COMPRA
    </div>
    <div class="card-body">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Quantidade BTC</th>
            <th>Preço</th>
            <th>Valor Ordem</th>
          </tr>
        </thead>
        <tbody id="tbody_buy_order" style="cursor: pointer;">
          <tr v-for="{id, btc, price, tax} in orders" v-on:click="addBuy(id)" :id="`buy_tr_${id}`">
            <td><input :id="`btc_${id}`" type="hidden" :value="btc"> BTC {{ parseFloat(btc).toFixed(8) }}</td>
            <td><input :id="`price_${id}`" type="hidden" :value="price">{{ fmt_c(price) }}</td>
            <td><input :id="`tax_${id}`" type="hidden" :value="tax">{{ tax }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>
<script>
import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import {Money} from './../lib/v-money';
import {format_currency} from './../lib/utils';
export default {
	components: {Money},
	data (){
		return {
				buy_price: "32622,56",
				buy_bit_coin: 0,
        buy_total: 0,
        count: 0,
        orders: [],
		}
	},
	watch: {
		buy_price: function(){
       this.buy_total = this.buy_price * this.buy_bit_coin;
		},
		buy_total: function(){
      let price = this.buy_price;
			if (price > 0){
        let total = this.buy_total;
				let btc = (((total/price)*1e-8)/1e-8);
				this.buy_bit_coin = btc;
      }
    },
    buy_bit_coin: function(){
    }
	},
	computed: {
		buy_total_taxa: function(){
      let total = this.buy_price * this.buy_bit_coin;
			this.buy_total = total;
			return format_currency((total * 0.0035) + total);
		},
		buy_taxa: function(){
			let total = this.buy_price * this.buy_bit_coin;
			return format_currency(total * 0.0035);
		}
  },
  methods: {
      buy: function(event){
        $("#confirmBuy").modal('show');
      },
      buyYes: function(e){
        $("#confirmBuy").modal('hide');
        this.orders.push({id: this.orders.length, btc: this.buy_bit_coin, price: parseFloat(this.buy_price), tax: this.buy_total_taxa});
        this.count += 1;
      },
      addBuy: function(id){
        let btc = $("#btc_" + id).val();
        let price = $("#price_" + id).val();
        this.buy_bit_coin = parseFloat(btc);
        this.buy_price = parseFloat(price).toFixed(2);
        $("#buy_tr_" + id).remove();
      },
      fmt_c: function(v){
        return "R$" + v.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      }
  }
}
</script>
<style lang="scss">
@import '../../node_modules/bootstrap/scss/bootstrap.scss';
</style>