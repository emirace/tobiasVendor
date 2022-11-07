import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 10vw;
  text-align: justify;
`;
const RedTitle = styled.h3`
  text-align: center;
  font-size: 1.2rem;
  color: var(--red-color);
  margin-top: 15px;
`;
export default function Returns() {
  return (
    <Container>
      <RedTitle>RETURN POLICY</RedTitle>
      <p>
        We are fully aware certain things may not always go our way or according
        to our plans and we are here to fully support you every step of the way
        to ensure you have the very best experience using our platform. However,
        we strongly encourage both Sellers and Buyers to take precaution when
        selling or buying in order to avoid what may lead to back and forth of
        returns and refunds.
      </p>
      <RedTitle>YOUR RIGHT!</RedTitle>
      <p>
        If your purchase is eligible for returns, it’s within your right to log
        a return within 72hours (3 days) after receiving your order and you will
        be fully refunded. Firstly, within 72hrs of receiving the product, buyer
        must log a return or message seller through the Log a Return letting the
        seller know about the issue. The seller and buyer may reach a suitable
        agreement for both party to resolve the issue, if the buyer insist of
        returning eligible product, the buyer must request for seller’s
        preferred return information/address and log the product before 72hours
        (3 days) from the date and time order was delivered elapse.
      </p>
      <p>
        The return should be sent to the seller’s provided delivery address
        information using the same shipping method the buyer received the order,
        unless otherwise agreed between seller and buyer.
      </p>
      <RedTitle>RETURN ELIGIBILITY:</RedTitle>
      <p>
        Your purchase is eligible for return if any of the below issue is
        associated with you order. Please be sure to report this on Repeddle App
        or Website within 72hours (3 days) of receipt.
      </p>
      <ol>
        <li>
          The product was misrepresented and your purchased order is remarkably
          different from the listing descriptions.
        </li>
        <li>Product condition is significantly not as described.</li>
        <li>Missing or wrong product “not what I ordered”</li>
        <li>Product has significant undisclosed damage.</li>
      </ol>
      <p>
        Should you not Log a Return on Repeddle App or Website within 72hours (3
        days) you received your delivery, payment will be automatically remitted
        to the seller. Immediately the seller has been paid, we are not obliged
        to dispute any sale or refund you.
      </p>

      <RedTitle>NOT ELIGIBLE:</RedTitle>
      <ol>
        <li>You changed your mind</li>
        <li> Fit issues</li>
        <li>Delayed delivery</li>
      </ol>
      <p>
        If your purchase is not eligible for return, no worries, we got your
        back. With our easy to use selling tools, you can relist your purchased
        product within a minute and you are up to grabbing your money back into
        your pocket. No regrets, All money back!
      </p>
      <RedTitle>LOGGING A RETURN?</RedTitle>
      <b>How to Log a Return:</b>
      <p>
        Ensure to upload pictures that clearly show your reason and include a
        detailed description of the reason for the return.
      </p>
      <ul>
        <li> Login to your account</li>
        <li>Click on your profile picture</li>
        <li>Select Purchased Orders</li>
        <li>
          {" "}
          From Purchase Product history, select View on the order you wish to
          return
        </li>
        <li> From Items in Your Order, select Log a Return</li>
        <li>Select the Product you wish to return</li>
        <li>
          {" "}
          Fill out the correct information accordingly and describe reason
        </li>
        <li>Upload Image and submit</li>
      </ul>
      <div>Note:</div>
      <ul>
        <li>
          {" "}
          If you wish to Re-list the product to sell or wish to contact the
          seller directly to return, please select any of that option from
          Preferred Resolution Method and use the link accordingly.
        </li>
        <li>
          Should you want to log a return, please do not confirm you have
          received order until we advise you on how to proceed. Once you
          confirm, the fund will be paid to the seller. Unfortunately, we are
          unable to honor a return or reverse the payment to refund your account
          once fund is remitted to seller.
        </li>
        <li>
          All eligible returns must be log within 72hours (3days) of received
          delivery. You will send back the product to the provided delivery
          information within 72hours (3 days) you received the return
          information. Should you not log a return within 3days, the fund will
          automatically be paid to the seller’s account at the elapse of the 3rd
          day you received your delivery.
        </li>
        <li>
          {" "}
          Returns only become eligible when logged through the Log a Return
          channel, emailing support does not qualify your return as eligible.
        </li>
      </ul>
      <RedTitle>REFUND POLICY</RedTitle>

      <p>
        When you make a purchase on Repeddle, we hold the payment of your
        purchase until we know you have received your order as described. We
        allow you 72hours (3 days) after delivery to notify us if the product is
        significantly not as described or has been misrepresented by logging a
        return with description and clear image to support your claim on
        Repeddle App or Website. For Refund, remember to use the Log a Return
        channel should you wish to return the product. Once we receive your
        return request, we will process and verify the discrepancy, after
        verification, we approve your return and prompt the seller to furnish
        you with their shipping address information to receive the return and
        once seller confirms the receipt of their product, we will refund you in
        full.
      </p>
      <p>
        With our Repeddle Buyer’s &amp; Seller’s protection, your transaction
        and payments (both Buyers &amp; Sellers) are fully covered only when
        they are all completed within Repeddle App and Website. We are not able
        to make any guarantee of getting your product or payment when
        transaction is taken outside Repeddle. All risk involved at that point
        is fully yours.
      </p>
      <p>
        <b>Note:</b> For your refund to be eligible and processed, the seller
        must receive their product within the delivery time frame according to
        the chosen sending method but not more than 10 days from when you
        receive the seller’s delivery information to send the return. Once
        return receipt is confirmed by the seller, the refund will be made
        available in your Repeddle wallet, the buyer chooses to either use the
        funds to shop on Repeddle or transfer it to their provided bank account.
        Be sure to keep all return proof for further inquiries should the need
        arise.
      </p>
      <RedTitle>WHO COVERS THE RETURN SHIPPING COST?</RedTitle>
      <p>
        We advise that all returns must be a valid reason caused by a seller. As
        a result, the seller covers the cost of shipment. Should you wish to
        return for any other reasons not started under Return Eligibility, we
        are unfortunately not able to process such return. However, you can
        Re-list the product for sale on Repeddle App or Website. To avoid a
        problem with a sale or paying for return cost, we advise sellers to be
        as descriptive, transparent and well detailed as possible when adding a
        product. We encourage buyers to review the listing photos, description,
        size and item condition when shopping, and if you have any questions,
        please use the message system to ask the seller for additional details,
        measurements, or photos. Sellers are usually more than happy to provide
        additional information.
      </p>
    </Container>
  );
}
