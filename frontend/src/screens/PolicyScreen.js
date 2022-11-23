import React from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 15vw;
  @media (max-width: 500px) {
    margin: 0 5vw;
  }
`;
const Header = styled.h4``;
const SubHeader = styled.h3`
  font-size: 1.2rem;
  color: var(--red-color);
  margin-top: 15px;
  text-transform: capitalize;
`;
const Para = styled.p`
  text-align: justify;
`;

export default function PolicyScreen() {
  return (
    <Container>
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>
      <Header>Repeddle Privacy Policy</Header>

      <Para>
        This Privacy Policy describes how your personal information is
        collected, used, and shared when you visit, use or make a purchase from
        repeddle (the “App or Website”). By using any part of our platforms,
        services, App or Website you are deemed to have read, understand and
        agreed to be bound by this privacy policy.
      </Para>

      <SubHeader>personal information we collect </SubHeader>
      <Para>
        When you visit our App or WebSite, we automatically collect certain
        information about your device, including information about your web
        browser, IP address, time zone, and some of the cookies that are
        installed on your device. Additionally, as you browse the Site, we
        collect information about the individual web pages or products that you
        view, what websites or search terms referred you to the Site, and
        information about how you interact with the App or Website. We refer to
        this automatically-collected information as “Device Information”.{" "}
      </Para>

      <Para>
        We collect Device Information using the following technologies: Cookies-
        “Cookies” are data files that are placed on your device or computer and
        often include an anonymous unique identifier. For more information about
        cookies, and how to disable cookies, visit
        http://www.allaboutcookies.org. - “Log files” track actions occurring on
        the Site, and collect data including your IP address, browser type,
        Internet service provider, referring/exit pages, and date/time stamps. -
        “Web beacons”, “tags”, and “pixels” are electronic files used to record
        information about how you browse the Site.
      </Para>

      <Para>
        Additionally, when you make a purchase or attempt to make a purchase
        through our App or Website, we collect certain information from you,
        including your name, billing address, shipping address, payment
        information (including credit card numbers), email address, and phone
        number. We refer to this information as “Order Information”.{" "}
      </Para>

      <Para>
        When we talk about “Personal Information” in this Privacy Policy, we are
        talking both about Device Information and Order Information. Understand
        that you are obliged to provide us with accurate and correct information
        when registering, signing-up or making any purchase on our Site. This
        information includes but not limited to: Your full name “First and
        Surname”, Date of birth, Email address, Phone number, physical
        address/postal (delivery)address, Gender and correct card information.
        We will not be liable for any cancellation of order, miscommunication or
        wrong delivery due to your false or miss-information.
      </Para>

      <SubHeader>how we use your personal information</SubHeader>
      <Para>
        We use the Order Information that we collect generally to fulfill any
        orders placed through the Site (including processing your payment
        information, arranging for shipping, and providing you with invoices
        and/or order confirmations). Additionally, we use this Order Information
        to:
        <ul>
          <li> Communicate with you;</li>
          <li> Screen our orders for potential risk or fraud; and</li>
          <li>
            {" "}
            When in line with the preferences you have shared with us, provide
            you with information or advertising relating to our products or
            services.
          </li>
        </ul>
      </Para>

      <Para>
        We use the Device Information that we collect to help us screen for
        potential risk and fraud (in particular, your IP address), and more
        generally to improve and optimize our Site (for example, by generating
        analytics about how our customers browse and interact with the Site, and
        to assess the success of our marketing and advertising campaigns).{" "}
      </Para>

      <SubHeader>social media networks</SubHeader>
      <Para>
        Our company is a social e-commerce marketplace, this means we may use a
        lot of social media interactions and links such as Instagram, Facebook,
        TikTok, Twitter, Pintrest, LinkedIn, Youtube etc, to communicate with
        both our community and the general public. When you use any form of our
        platform, we may use any part of the content as deem fit for both
        marketing and communication purposes and the social media networks we
        use may collect any part of your information, or the information shared
        for its own purposes. This information may be collected through the
        links (both ours and theirs) that you might have shared on any of their
        platform. These services have its own privacy policies which are
        independent to the company. Please ensure to read these services privacy
        policies.
      </Para>

      <SubHeader>sharing your personal information </SubHeader>
      <Para>
        We share your Personal Information with third parties to help us use
        your Personal Information, as described above. For example, we use
        Amazon(AWS) to power our online store--you can read more about how
        Amazon uses your Personal Information here:
        https://aws.amazon.com/privacy/?nc1=f_pr. We also use Google Analytics
        to help us understand how our customers use the Site -- you can read
        more about how Google uses your Personal Information here:
        https://www.google.com/intl/en/policies/privacy/. You can also opt-out
        of Google Analytics here: https://tools.google.com/dlpage/gaoptout.{" "}
      </Para>

      <Para>
        Finally, we may also share your Personal Information to comply with
        applicable laws and regulations, to respond to a subpoena, search
        warrant or other lawful request for information we receive, or to
        otherwise protect our rights.{" "}
      </Para>

      <SubHeader>behavioral advertising </SubHeader>
      <Para>
        As described above, we use your Personal Information to provide you with
        targeted advertisements or marketing communications we believe may be of
        interest to you. For more information about how targeted advertising
        works, you can visit the Network Advertising Initiative’s (“NAI”)
        educational page at
        http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.{" "}
      </Para>

      <Para>
        You can opt out of targeted advertising by using the links below:
        <ul>
          <li>Facebook: https://www.facebook.com/settings/?tab=ads</li>
          <li>Google: https://www.google.com/settings/ads/anonymous</li>
          <li>
            Bing: https://advertise.bingads.microsoft.com/en
            us/resources/policies/personalized-ads{" "}
          </li>
        </ul>
      </Para>

      <Para>
        Additionally, you can opt out of some of these services by visiting the
        Digital Advertising Alliance’s opt-out portal at:
        http://optout.aboutads.info/.{" "}
      </Para>

      <SubHeader>do not track </SubHeader>
      <Para>
        Please note that we do not alter our Site’s data collection and use
        practices when we see a Do Not Track signal from your browser.{" "}
      </Para>
      <SubHeader>Cookies</SubHeader>
      <Para>
        Cookies are text files, often encrypted, stored in your browser. They
        are created when a user’s browser loads a given website: the website
        sends information to the browser, which then creates a text file. Each
        time the user returns to the same site, the browser retrieves this file
        and sends it to the website’s server.
      </Para>
      <Para>
        We can distinguish two types of cookies, which have different purposes:
        technical cookies and advertising cookies:
      </Para>
      <Para>
        Technical cookies are used throughout your browsing experience to
        facilitate and perform certain functions. For example, a technical
        cookie may be used to remember the answers you give in a form or the
        user’s preferences for the language or layout of a website, where such
        options are available.
      </Para>
      <Para>
        Advertising cookies may be created not only by the website on which the
        user is browsing, but also by other websites displaying advertisements,
        announcements, widgets or other elements on the page displayed. These
        cookies can be used to carry out targeted advertising, i.e. advertising
        determined according to the user’s navigation.
      </Para>
      <Para>
        We use technical cookies. These are stored in your browser for a period
        not exceeding six months.
      </Para>
      <Para>
        We do not use advertising cookies. However, if we were to use them in
        the future, we would inform you in advance and you would have the
        possibility to deactivate these cookies.
      </Para>
      <Para>
        We use or may use Google Analytics which is a statistical audience
        analysis tool that generates a cookie to measure the number of visits to
        the site, the number of pages viewed and visitor activity. Your IP
        address is also collected to determine the city from which you connect.
      </Para>
      <Para>
        We remind you that you can refuse the deposit of cookies by configuring
        your browser. However, such a refusal could prevent the site from
        functioning properly.
      </Para>

      <SubHeader> your rights</SubHeader>
      <Para>
        If you are a European resident, you have the right to access personal
        information we hold about you and to ask that your personal information
        be corrected, updated, or deleted. If you would like to exercise this
        right, please contact us through the contact information below.{" "}
      </Para>

      <Para>
        Additionally, if you are a European resident we note that we are
        processing your information in order to fulfill contracts we might have
        with you (for example if you make an order through the Site), or
        otherwise to pursue our legitimate business interests listed above.
        Additionally, please note that your information will be transferred
        outside of Europe, including to Canada and the United States.{" "}
      </Para>

      <SubHeader>data retention</SubHeader>
      <Para>
        When you place an order through the Site, we will maintain your Order
        Information for our records unless and until you ask us to delete this
        information.{" "}
      </Para>

      <SubHeader>Facebook Data Deletion Instructions URL </SubHeader>
      <Para>
        Repeddle does not save your Facebook personal data on its server.
        However, according to Facebook policy, we have to provide User Data
        Deletion Callback URL or Data Deletion Instructions URL. If you want to
        delete your data from Repeddle App, you can remove your information by
        following these steps:
        <ol>
          <li>
            Go to your Facebook Account’s Setting & Privacy. Click “Settings”
          </li>
          <li>
            Look for “Apps and Websites” and you will see all of the apps and
            websites you linked with your Facebook.
          </li>
          <li> Search and Click “Repeddle” in the search bar.</li>
          <li> Scroll and click “Remove”.</li>
          <li>
            Congratulations, you have successfully removed your app activities
            and data from the Repeddle App
          </li>
        </ol>
      </Para>

      <SubHeader> changes</SubHeader>
      <Para>
        We may update this privacy policy from time to time in order to reflect,
        for example, changes to our practices or for other operational, legal or
        regulatory reasons.{" "}
      </Para>

      <SubHeader>popia disclaimer(SA)</SubHeader>
      <Para>
        By viewing this App or Website, you hereby acknowledge that you have
        read and accepted the Protection of Personal Information (POPIA)
        disclaimer. Repeddle shall take all reasonable measures to protect the
        personal information of data subjects and for the purpose of this
        disclaimer “personal information” shall be defined as detailed in the
        Promotion of Access to Information Act, Act 2 of 2000 (“PAIA”) and the
        Protection of Personal Information Act, Act 4 of 2013 (“POPI”) The PAIA
        and POPIA Acts are available online at www.gov.za/documents/acts
        According to these definitions, personal information refers to
        information that relates to you specifically, such as your name, age,
        gender, identity number, email address etc. Repeddle may collects,
        stores, and uses your information primarily for the following purposes:
        <ul>
          <li>
            To provide services to you as instructed and requested by you.
          </li>
          <li>To authenticate your information as per clients’ requests</li>
          <li>
            To verify your details for transactional purpose in a bid to avoid
            fraud or fraudulent act.
          </li>
          <li>
            To track and compile non-personal statistical information about
            browsing habits, click patterns and access to our App or Website.
          </li>
        </ul>
      </Para>

      <Para>
        Whenever you use our App or Website, contact us electronically or use
        any or one of the services offered by us through any of our platform or
        communication channel, we may collect your personal information. The
        information we maintain concerning our clients is stored in databases
        (where that have built-in safeguards to ensure its privacy and
        confidentiality. Repeddle accepts no obligation or liability whatsoever
        for any loss, damage (whether direct, indirect, special, or
        consequential) and/or expenses of any nature whatsoever which may arise
        as a result of, or which may be attributed directly or indirectly from
        information made available on these pages or links, or actions or
        transaction resulting therefrom.
      </Para>
      <SubHeader> security</SubHeader>
      <Para>
        Repeddle takes the security of personal information very seriously and
        will always do its possible best to comply with applicable data
        protection laws. Our hosting company will host our App and Website in a
        secure server environment that uses firewall and other advance 3D
        security measures to prevent interfaces or access from outside
        intruders. Repeddle authorizes access to personal information only for
        those employees who require the information to fulfill their job
        obligations.
      </Para>

      <SubHeader> limitation</SubHeader>
      <Para>
        Repeddle will not be responsible to give warranties, nor make any
        representations in respect of the privacy policies of links or any
        third-party websites.
      </Para>

      <SubHeader>contact us</SubHeader>
      <Para>
        For more information about our privacy practices, if you have questions,
        or if you would like to make a complaint, please contact us by e‑mail at
        support@repeddle.com
      </Para>
    </Container>
  );
}
