<template>
<div class="content">
  <div class="card">
    <div class="card-header alert-danger">
      VENDER tBTC
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
            <money :value="sell_price" v-model.lazy="sell_price" v-bind="money"></money>
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="for_quantity">Quantidade</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">BTC</div>
            </div>
            <money :value="sell_bit_coin" v-model.lazy="sell_bit_coin" v-bind="money" precision="8"></money>
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
            <money :value="sell_total" v-model.lazy="sell_total" v-bind="money" precision="2"></money>
          </div>
        </div>
      </div>
    <table class="table">
      <tbody>
        <tr>
          <td align="left">Taxa 0.35%</td> 
          <td align="right" width="50%"><span>{{ sell_taxa }}</span></td>
        </tr>
        <tr>
          <td align="left">Valor da ordem</td> 
          <td align="right" width="50%"><span>{{ sell_total_taxa }}</span></td>
        </tr> 
        <tr>
          <td align="left">Posição no livro</td>
          <td align="right" width="50%"><span id="total_compra">{{ count }}</span></td>
        </tr>
      </tbody>
    </table>
      <hr/>
      <button v-on:click="sell" type="button" class="btn btn-outline-danger btn-lg btn-block" data-target="#confirmsell">Vender</button>
      <!-- Modal -->
      <div class="modal fade" id="confirmsell" tabindex="-1" role="dialog" aria-labelledby="confirmsellLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmsellLabel">Deseja confirmar sua ordem de compra?</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Você confirma sua ordem de compra em BRLtBTC <br/>
              Preço: <span id="mdPrice">R$ {{ sell_price }}</span> <br/>
              Quantidade: <span id="mdQuantity">BTC {{ sell_bit_coin.toFixed(8) }}</span> <br/>
              Taxa: <span id="mdTax">{{ this.sell_taxa }}</span> <br/>
              Total: <span id="mdAmount">{{ this.sell_total_taxa }}</span> <br/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Não</button>
              <button type="button" v-on:click="sellYes" class="btn btn-primary">Sim</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    </div>
  </div>
  <div class="card" style="margin-top:30px;">
    <div class="card-header alert-danger">
        ORDENS DE VENDA
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
        <tbody id="tbody_sell_order" style="cursor: pointer;">
          <tr v-for="{id, btc, price, tax} in orders" v-on:click="addsell(id)" :id="`sell_tr_${id}`">
            <td><input :id="`btc_${id}`" type="hidden" :value="btc"> BTC {{ btc.toFixed(8) }}</td>
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
				sell_price: "32622,56",
				sell_bit_coin: 0,
        sell_total: 0,
        count: 0,
        orders: [],
		}
	},
	watch: {
		sell_price: function(){
       this.sell_total = this.sell_price * this.sell_bit_coin;
		},
		sell_total: function(){
      let price = this.sell_price;
			if (price > 0){
        let total = this.sell_total;
				let btc = (((total/price)*1e-8)/1e-8);
				this.sell_bit_coin = btc;
      }
    },
    sell_bit_coin: function(){
    }
	},
	computed: {
		sell_total_taxa: function(){
      let total = this.sell_price * this.sell_bit_coin;
			this.sell_total = total;
			return format_currency((total * 0.0025) + total);
		},
		sell_taxa: function(){
			let total = this.sell_price * this.sell_bit_coin;
			return format_currency(total * 0.0025);
		}
  },
  methods: {
      sell: function(event){
        $("#confirmsell").modal('show');
      },
      sellYes: function(e){
        $("#confirmsell").modal('hide');
        this.orders.push({id: this.orders.length, btc: this.sell_bit_coin, price: parseFloat(this.sell_price), tax: this.sell_total_taxa});
        this.count += 1;
      },
      addsell: function(id){
        let btc = $("#btc_" + id).val();
        let price = $("#price_" + id).val();
        this.sell_bit_coin = btc;
        this.sell_price = parseFloat(price).toFixed(2);
        $("#sell_tr_" + id).remove();
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