package com.fooddelivery.fooddeliverybackend.dto.order;

import java.math.BigDecimal;

public class OrderSummaryCalculation {
	
	
	    private BigDecimal subtotal;
	    private BigDecimal deliveryFee;
	    private BigDecimal taxes;
	    private BigDecimal platformFee;
	    private BigDecimal total;

	    public OrderSummaryCalculation(BigDecimal subtotal, BigDecimal deliveryFee,
	                                   BigDecimal taxes, BigDecimal platformFee, BigDecimal total) {
	        this.subtotal = subtotal;
	        this.deliveryFee = deliveryFee;
	        this.taxes = taxes;
	        this.platformFee = platformFee;
	        this.total = total;
	    }

		public BigDecimal getSubtotal() {
			return subtotal;
		}

		public void setSubtotal(BigDecimal subtotal) {
			this.subtotal = subtotal;
		}

		public BigDecimal getDeliveryFee() {
			return deliveryFee;
		}

		public void setDeliveryFee(BigDecimal deliveryFee) {
			this.deliveryFee = deliveryFee;
		}

		public BigDecimal getTaxes() {
			return taxes;
		}

		public void setTaxes(BigDecimal taxes) {
			this.taxes = taxes;
		}

		public BigDecimal getPlatformFee() {
			return platformFee;
		}

		public void setPlatformFee(BigDecimal platformFee) {
			this.platformFee = platformFee;
		}

		public BigDecimal getTotal() {
			return total;
		}

		public void setTotal(BigDecimal total) {
			this.total = total;
		}

	    
	


}
