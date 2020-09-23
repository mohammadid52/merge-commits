import React, { useContext } from "react";
import { GlobalContext } from "../../contexts/GlobalContext";
import { NavLink } from "react-router-dom";

const Privacy = () => {
  const { theme, state, dispatch } = useContext(GlobalContext);


  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div
        className={`w-full h-.7/10 md:h-12 ${theme.toolbar.bg} text-gray-200 flex justify-center md:justify-end`}
      >
        <div
          className={`w-full h-full md:h-12 ${theme.toolbar.bg} flex text-2xl font-bold z-50 ml-4`}
        >
          <NavLink to="/login" className="h-6 md:h-12 w-28 p-2 md:p-0">
            <img
              className="md:p-2 w-28 h-6 md:h-12 flex justify-center items-center text-center"
              src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg"
              alt="Iconoclast Artist"
            />
          </NavLink>
        </div>

        <div
          className={`w-full md:w-32 h-full md:flex flex-row justify-end mr-8`}
        >
          <button
            className={`h-full flex justify-end md:justify-center items-center text-xs md:text-lg py-2`}
          >
            <NavLink to="/login">Login</NavLink>
          </button>
        </div>
      </div>

      <div className="h-9.3/10 py-8 px-28">
        <div className="text-3xl font-bold py-4">Iconoclast Artist</div>
        <div className="text-2xl font-bold pb-4">Privacy Policy</div>
        <div className="pb-2">Last updated: September 21, 2020</div>

        <div className="pb-2">
          This Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You.
        </div>

        <div className="pb-2">
          We use Your Personal data to provide and improve the Service. By using
          the Service, You agree to the collection and use of information in
          accordance with this Privacy Policy.
        </div>

        <div className="text-2xl font-bold pb-4">
          Interpretation and Definitions
        </div>
        <div className="text-xl font-bold pb-4">Interpretation</div>
        <div className="pb-2">
          The words of which the initial letter is capitalized have meanings
          defined under the following conditions.
        </div>

        <div className="pb-2">
          The following definitions shall have the same meaning regardless of
          whether they appear in singular or in plural.
        </div>

        <div className="text-xl font-bold pb-4">Definitions</div>
        <div className="pb-2">For the purposes of this Privacy Policy:</div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            <div className="pb-2">
              You means the individual accessing or using the Service, or the
              company, or other legal entity on behalf of which such individual
              is accessing or using the Service, as applicable.
            </div>

            <div className="pb-2">
              Under GDPR (General Data Protection Regulation), You can be
              referred to as the Data Subject or as the User as you are the
              individual using the Service.
            </div>
          </li>

          <li className="pb-2">
            Company (referred to as either "the Company", "We", "Us" or "Our" in
            this Agreement) refers to Project Curate, 11140 Greenbay St,
            Houston, TX 77024, United States. For the purpose of the GDPR, the
            Company is the Data Controller.
          </li>

          <li className="pb-2">
            Application means the software program provided by the Company
            downloaded by You on any electronic device, named Iconoclast Artists
          </li>
          <li className="pb-2">
            Affiliate means an entity that controls, is controlled by or is
            under common control with a party, where "control" means ownership
            of 50% or more of the shares, equity interest or other securities
            entitled to vote for election of directors or other managing
            authority.
          </li>
          <li className="pb-2">
            Account means a unique account created for You to access our Service
            or parts of our Service.
          </li>
          <li className="pb-2">
            Website refers to SEL Ready, accessible from http://www.selready.com
          </li>
          <li className="pb-2">
            Service refers to the Application or the Website or both.
          </li>
          <li className="pb-2">Country refers to: Texas, United States</li>
          <li className="pb-2">
            Service Provider means any natural or legal person who processes the
            data on behalf of the Company. It refers to third-party companies or
            individuals employed by the Company to facilitate the Service, to
            provide the Service on behalf of the Company, to perform services
            related to the Service or to assist the Company in analyzing how the
            Service is used.
          </li>

          <div className="pb-2">
            For the purpose of the GDPR, Service Providers are considered Data
            Processors.
          </div>

          <li className="pb-2">
            Third-party Social Media Service refers to any website or any social
            network website through which a User can log in or create an account
            to use the Service.
          </li>
          <li className="pb-2">
            Facebook Fan Page is a public profile named SEL Ready specifically
            created by the Company on the Facebook social network, accessible
            from https://facebook.com/selready
          </li>
          <li className="pb-2">
            Personal Data is any information that relates to an identified or
            identifiable individual.
          </li>

          <div className="pb-2">
            For the purposes for GDPR, Personal Data means any information
            relating to You such as a name, an identification number, location
            data, online identifier or to one or more factors specific to the
            physical, physiological, genetic, mental, economic, cultural or
            social identity.
          </div>

          <div className="pb-2">
            For the purposes of the CCPA, Personal Data means any information
            that identifies, relates to, describes or is capable of being
            associated with, or could reasonably be linked, directly or
            indirectly, with You.
          </div>

          <li className="pb-2">
            Cookies are small files that are placed on Your computer, mobile
            device or any other device by a website, containing the details of
            Your browsing history on that website among its many uses.
          </li>
          <li className="pb-2">
            Device means any device that can access the Service such as a
            computer, a cellphone or a digital tablet.
          </li>
          <li className="pb-2">
            Usage Data refers to data collected automatically, either generated
            by the use of the Service or from the Service infrastructure itself
            (for example, the duration of a page visit).
          </li>
          <li className="pb-2">
            Data Controller, for the purposes of the GDPR (General Data
            Protection Regulation), refers to the Company as the legal person
            which alone or jointly with others determines the purposes and means
            of the processing of Personal Data.
          </li>
          <li className="pb-2">
            Do Not Track (DNT) is a concept that has been promoted by US
            regulatory authorities, in particular the U.S. Federal Trade
            Commission (FTC), for the Internet industry to develop and implement
            a mechanism for allowing internet users to control the tracking of
            their online activities across websites.
          </li>
          <li className="pb-2">
            Business, for the purpose of the CCPA (California Consumer Privacy
            Act), refers to the Company as the legal entity that collects
            Consumers' personal information and determines the purposes and
            means of the processing of Consumers' personal information, or on
            behalf of which such information is collected and that alone, or
            jointly with others, determines the purposes and means of the
            processing of consumers' personal information, that does business in
            the State of California.
          </li>
          <li className="pb-2">
            Consumer, for the purpose of the CCPA (California Consumer Privacy
            Act), means a natural person who is a California resident. A
            resident, as defined in the law, includes (1) every individual who
            is in the USA for other than a temporary or transitory purpose, and
            (2) every individual who is domiciled in the USA who is outside the
            USA for a temporary or transitory purpose.
          </li>
          <li className="pb-2">
            Sale, for the purpose of the CCPA (California Consumer Privacy Act),
            means selling, renting, releasing, disclosing, disseminating, making
            available, transferring, or otherwise communicating orally, in
            writing, or by electronic or other means, a Consumer’s Personal
            information to another business or a third party for monetary or
            other valuable consideration.
          </li>
        </ul>

        <div className="text-xl font-bold pb-4">
          Collecting and Using Your Personal Data
        </div>
        <div className="text-xl font-bold pb-4">Types of Data Collected</div>
        <div className="text-xl font-bold pb-4">Personal Data</div>
        <div className="pb-2">
          While using Our Service, We may ask You to provide Us with certain
          personally identifiable information that can be used to contact or
          identify You. Personally identifiable information may include, but is
          not limited to:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">Email address</li>
          <li className="pb-2">First name and last name</li>
          <li className="pb-2">Phone number</li>
          <li className="pb-2">Usage Data</li>
        </ul>
        <div className="text-xl font-bold pb-4">Usage Data</div>
        <div className="pb-2">
          Usage Data is collected automatically when using the Service.
        </div>

        <div className="pb-2">
          Usage Data may include information such as Your Device's Internet
          Protocol address (e.g. IP address), browser type, browser version, the
          pages of our Service that You visit, the time and date of Your visit,
          the time spent on those pages, unique device identifiers and other
          diagnostic data.
        </div>

        <div className="pb-2">
          When You access the Service by or through a mobile device, We may
          collect certain information automatically, including, but not limited
          to, the type of mobile device You use, Your mobile device unique ID,
          the IP address of Your mobile device, Your mobile operating system,
          the type of mobile Internet browser You use, unique device identifiers
          and other diagnostic data.
        </div>

        <div className="pb-2">
          We may also collect information that Your browser sends whenever You
          visit our Service or when You access the Service by or through a
          mobile device.
        </div>

        <div className="text-xl font-bold pb-4">
          Information from Third-Party Social Media Services
        </div>
        <div className="pb-2">
          The Company allows You to create an account and log in to use the
          Service through the following Third-party Social Media Services:
        </div>
        <div className="pb-2">
          While using Our Service, We may ask You to provide Us with certain
          personally identifiable information that can be used to contact or
          identify You. Personally identifiable information may include, but is
          not limited to:
        </div>

        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">Google</li>
          <li className="pb-2">Facebook</li>
          <li className="pb-2">Twitter</li>
        </ul>

        <div className="pb-2">
          If You decide to register through or otherwise grant us access to a
          Third-Party Social Media Service, We may collect Personal data that is
          already associated with Your Third-Party Social Media Service's
          account, such as Your name, Your email address, Your activities or
          Your contact list associated with that account.
        </div>

        <div className="pb-2">
          You may also have the option of sharing additional information with
          the Company through Your Third-Party Social Media Service's account.
          If You choose to provide such information and Personal Data, during
          registration or otherwise, You are giving the Company permission to
          use, share, and store it in a manner consistent with this Privacy
          Policy.
        </div>

        <div className="text-xl font-bold pb-4">
          Information Collected while Using the Application
        </div>
        <div className="pb-2">
          While using Our Application, in order to provide features of Our
          Application, We may collect, with your prior permission:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            Pictures and other information from your Device's camera and photo
            library
          </li>
        </ul>
        <div className="pb-2">
          We use this information to provide features of Our Service, to improve
          and customize Our Service. The information may be uploaded to the
          Company's servers and/or a Service Provider's server or it be simply
          stored on Your device.
        </div>

        <div className="pb-2">
          You can enable or disable access to this information at any time,
          through Your Device settings. You can also enable or disable location
          services when You use Our Service at any time, through Your Device
          settings.
        </div>

        <div className="text-xl font-bold pb-4">
          Tracking Technologies and Cookies
        </div>
        <div className="pb-2">
          We use Cookies and similar tracking technologies to track the activity
          on Our Service and store certain information. Tracking technologies
          used are beacons, tags, and scripts to collect and track information
          and to improve and analyze Our Service.
        </div>

        <div className="pb-2">
          You can instruct Your browser to refuse all Cookies or to indicate
          when a Cookie is being sent. However, if You do not accept Cookies,
          You may not be able to use some parts of our Service.
        </div>

        <div className="pb-2">
          Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies
          remain on your personal computer or mobile device when You go offline,
          while Session Cookies are deleted as soon as You close your web
          browser.
        </div>

        <div className="pb-2">
          We use both session and persistent Cookies for the purposes set out
          below:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            <div className="pb-2">Necessary / Essential Cookies</div>

            <div className="pb-2">Type: Session Cookies</div>

            <div className="pb-2">Administered by: Us</div>

            <div className="pb-2">
              Purpose: These Cookies are essential to provide You with services
              available through the Website and to enable You to use some of its
              features. They help to authenticate users and prevent fraudulent
              use of user accounts. Without these Cookies, the services that You
              have asked for cannot be provided, and We only use these Cookies
              to provide You with those services.
            </div>
          </li>

          <li className="pb-2">
            <div className="pb-2">
              Cookies Policy / Notice Acceptance Cookies
            </div>

            <div className="pb-2">Type: Persistent Cookies</div>

            <div className="pb-2">Administered by: Us</div>

            <div className="pb-2">
              Purpose: These Cookies identify if users have accepted the use of
              cookies on the Website.
            </div>
          </li>
          <li className="pb-2">
            <div className="pb-2">Functionality Cookies</div>

            <div className="pb-2">Type: Persistent Cookies</div>

            <div className="pb-2">Administered by: Us</div>

            <div className="pb-2">
              Purpose: These Cookies allow us to remember choices You make when
              You use the Website, such as remembering your login details or
              language preference. The purpose of these Cookies is to provide
              You with a more personal experience and to avoid You having to
              re-enter your preferences every time You use the Website.
            </div>
          </li>
        </ul>

        <div className="pb-2">
          For more information about the cookies we use and your choices
          regarding cookies, please visit our Cookies Policy.
        </div>

        <div className="text-xl font-bold pb-4">Use of Your Personal Data</div>
        <div className="pb-2">
          The Company may use Personal Data for the following purposes:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            To provide and maintain our Service, including to monitor the usage
            of our Service.
          </li>
          <li className="pb-2">
            To manage Your Account: to manage Your registration as a user of the
            Service. The Personal Data You provide can give You access to
            different functionalities of the Service that are available to You
            as a registered user.
          </li>
          <li className="pb-2">
            For the performance of a contract: the development, compliance and
            undertaking of the purchase contract for the products, items or
            services You have purchased or of any other contract with Us through
            the Service.
          </li>
          <li className="pb-2">
            To contact You: To contact You by email, telephone calls, SMS, or
            other equivalent forms of electronic communication, such as a mobile
            application's push notifications regarding updates or informative
            communications related to the functionalities, products or
            contracted services, including the security updates, when necessary
            or reasonable for their implementation.
          </li>
          <li className="pb-2">
            To provide You with news, special offers and general information
            about other goods, services and events which we offer that are
            similar to those that you have already purchased or enquired about
            unless You have opted not to receive such information.
          </li>
          <li className="pb-2">
            To manage Your requests: To attend and manage Your requests to Us.
          </li>
        </ul>
        <div className="pb-2">
          We may share your personal information in the following situations:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            With Service Providers: We may share Your personal information with
            Service Providers to monitor and analyze the use of our Service, to
            show advertisements to You to help support and maintain Our Service,
            to contact You, to advertise on third party websites to You after
            You visited our Service or for payment processing.
          </li>
          <li className="pb-2">
            For Business transfers: We may share or transfer Your personal
            information in connection with, or during negotiations of, any
            merger, sale of Company assets, financing, or acquisition of all or
            a portion of our business to another company.
          </li>
          <li className="pb-2">
            With Affiliates: We may share Your information with Our affiliates,
            in which case we will require those affiliates to honor this Privacy
            Policy. Affiliates include Our parent company and any other
            subsidiaries, joint venture partners or other companies that We
            control or that are under common control with Us.
          </li>
          <li className="pb-2">
            With Business partners: We may share Your information with Our
            business partners to offer You certain products, services or
            promotions.
          </li>
          <li className="pb-2">
            With other users: when You share personal information or otherwise
            interact in the public areas with other users, such information may
            be viewed by all users and may be publicly distributed outside. If
            You interact with other users or register through a Third-Party
            Social Media Service, Your contacts on the Third-Party Social Media
            Service may see Your name, profile, pictures and description of Your
            activity. Similarly, other users will be able to view descriptions
            of Your activity, communicate with You and view Your profile.
          </li>
        </ul>
        <div className="text-xl font-bold pb-4">
          Retention of Your Personal Data
        </div>
        <div className="pb-2">
          The Company will retain Your Personal Data only for as long as is
          necessary for the purposes set out in this Privacy Policy. We will
          retain and use Your Personal Data to the extent necessary to comply
          with our legal obligations (for example, if we are required to retain
          your data to comply with applicable laws), resolve disputes, and
          enforce our legal agreements and policies.
        </div>

        <div className="pb-2">
          The Company will also retain Usage Data for internal analysis
          purposes. Usage Data is generally retained for a shorter period of
          time, except when this data is used to strengthen the security or to
          improve the functionality of Our Service, or We are legally obligated
          to retain this data for longer time periods.
        </div>

        <div className="text-xl font-bold pb-4">
          Transfer of Your Personal Data
        </div>
        <div className="pb-2">
          Your information, including Personal Data, is processed at the
          Company's operating offices and in any other places where the parties
          involved in the processing are located. It means that this information
          may be transferred to — and maintained on — computers located outside
          of Your state, province, country or other governmental jurisdiction
          where the data protection laws may differ than those from Your
          jurisdiction.
        </div>

        <div className="pb-2">
          Your consent to this Privacy Policy followed by Your submission of
          such information represents Your agreement to that transfer.
        </div>

        <div className="pb-2">
          The Company will take all steps reasonably necessary to ensure that
          Your data is treated securely and in accordance with this Privacy
          Policy and no transfer of Your Personal Data will take place to an
          organization or a country unless there are adequate controls in place
          including the security of Your data and other personal information.
        </div>

        <div className="text-xl font-bold pb-4">
          Disclosure of Your Personal Data
        </div>
        <div className="text-xl font-bold pb-4">Business Transactions</div>
        <div className="pb-2">
          If the Company is involved in a merger, acquisition or asset sale,
          Your Personal Data may be transferred. We will provide notice before
          Your Personal Data is transferred and becomes subject to a different
          Privacy Policy.
        </div>

        <div className="text-xl font-bold pb-4">Law enforcement</div>
        <div className="pb-2">
          Under certain circumstances, the Company may be required to disclose
          Your Personal Data if required to do so by law or in response to valid
          requests by public authorities (e.g. a court or a government agency).
        </div>

        <div className="text-xl font-bold pb-4">Other legal requirements</div>
        <div className="pb-2">
          The Company may disclose Your Personal Data in the good faith belief
          that such action is necessary to:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">Comply with a legal obligation</li>
          <li className="pb-2">
            Protect and defend the rights or property of the Company
          </li>
          <li className="pb-2">
            Prevent or investigate possible wrongdoing in connection with the
            Service
          </li>
          <li className="pb-2">
            Protect the personal safety of Users of the Service or the public
          </li>
          <li className="pb-2">Protect against legal liability</li>
        </ul>
        <div className="text-xl font-bold pb-4">
          Security of Your Personal Data
        </div>
        <div className="pb-2">
          The security of Your Personal Data is important to Us, but remember
          that no method of transmission over the Internet, or method of
          electronic storage is 100% secure. While We strive to use commercially
          acceptable means to protect Your Personal Data, We cannot guarantee
          its absolute security.
        </div>

        <div className="text-2xl font-bold pb-4">GDPR Privacy</div>
        <div className="text-xl font-bold pb-4">
          Legal Basis for Processing Personal Data under GDPR
        </div>
        <div className="pb-2">
          We may process Personal Data under the following conditions:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            Consent: You have given Your consent for processing Personal Data
            for one or more specific purposes.
          </li>
          <li className="pb-2">
            Performance of a contract: Provision of Personal Data is necessary
            for the performance of an agreement with You and/or for any
            pre-contractual obligations thereof.
          </li>
          <li className="pb-2">
            Legal obligations: Processing Personal Data is necessary for
            compliance with a legal obligation to which the Company is subject.
          </li>
          <li className="pb-2">
            Vital interests: Processing Personal Data is necessary in order to
            protect Your vital interests or of another natural person.
          </li>
          <li className="pb-2">
            Public interests: Processing Personal Data is related to a task that
            is carried out in the public interest or in the exercise of official
            authority vested in the Company.
          </li>
          <li className="pb-2">
            Legitimate interests: Processing Personal Data is necessary for the
            purposes of the legitimate interests pursued by the Company.
          </li>
        </ul>
        <div className="pb-2">
          In any case, the Company will gladly help to clarify the specific
          legal basis that applies to the processing, and in particular whether
          the provision of Personal Data is a statutory or contractual
          requirement, or a requirement necessary to enter into a contract.
        </div>

        <div className="text-xl font-bold pb-4">Your Rights under the GDPR</div>
        <div className="pb-2">
          The Company undertakes to respect the confidentiality of Your Personal
          Data and to guarantee You can exercise Your rights.
        </div>

        <div className="pb-2">
          You have the right under this Privacy Policy, and by law if You are
          within the EU, to:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            Request access to Your Personal Data. The right to access, update or
            delete the information We have on You. Whenever made possible, you
            can access, update or request deletion of Your Personal Data
            directly within Your account settings section. If you are unable to
            perform these actions yourself, please contact Us to assist You.
            This also enables You to receive a copy of the Personal Data We hold
            about You.
          </li>
          <li className="pb-2">
            Request correction of the Personal Data that We hold about You. You
            have the right to to have any incomplete or inaccurate information
            We hold about You corrected.
          </li>
          <li className="pb-2">
            Object to processing of Your Personal Data. This right exists where
            We are relying on a legitimate interest as the legal basis for Our
            processing and there is something about Your particular situation,
            which makes You want to object to our processing of Your Personal
            Data on this ground. You also have the right to object where We are
            processing Your Personal Data for direct marketing purposes.
          </li>
          <li className="pb-2">
            Request erasure of Your Personal Data. You have the right to ask Us
            to delete or remove Personal Data when there is no good reason for
            Us to continue processing it.
          </li>
          <li className="pb-2">
            Request the transfer of Your Personal Data. We will provide to You,
            or to a third-party You have chosen, Your Personal Data in a
            structured, commonly used, machine-readable format. Please note that
            this right only applies to automated information which You initially
            provided consent for Us to use or where We used the information to
            perform a contract with You.
          </li>
          <li className="pb-2">
            Withdraw Your consent. You have the right to withdraw Your consent
            on using your Personal Data. If You withdraw Your consent, We may
            not be able to provide You with access to certain specific
            functionalities of the Service.
          </li>
        </ul>
        <div className="text-xl font-bold pb-4">
          Exercising of Your GDPR Data Protection Rights
        </div>
        <div className="pb-2">
          You may exercise Your rights of access, rectification, cancellation
          and opposition by contacting Us. Please note that we may ask You to
          verify Your identity before responding to such requests. If You make a
          request, We will try our best to respond to You as soon as possible.
        </div>

        <div className="pb-2">
          You have the right to complain to a Data Protection Authority about
          Our collection and use of Your Personal Data. For more information, if
          You are in the European Economic Area (EEA), please contact Your local
          data protection authority in the EEA.
        </div>

        <div className="text-2xl font-bold pb-4">Facebook Fan Page</div>
        <div className="text-xl font-bold pb-4">
          Data Controller for the Facebook Fan Page
        </div>
        <div className="pb-2">
          The Company is the Data Controller of Your Personal Data collected
          while using the Service. As operator of the Facebook Fan Page
          (https://facebook.com/selready), the Company and the operator of the
          social network Facebook are Joint Controllers.
        </div>

        <div className="pb-2">
          The Company has entered into agreements with Facebook that define the
          terms for use of the Facebook Fan Page, among other things. These
          terms are mostly based on the Facebook Terms of Service:
          https://www.facebook.com/terms.php
        </div>

        <div className="pb-2">
          Visit the Facebook Privacy Policy https://www.facebook.com/policy.php
          for more information about how Facebook manages Personal data or
          contact Facebook online, or by mail: Facebook, Inc. ATTN, Privacy
          Operations, 1601 Willow Road, Menlo Park, CA 94025, United States.
        </div>

        <div className="text-xl font-bold pb-4">Facebook Insights</div>
        <div className="pb-2">
          We use the Facebook Insights function in connection with the operation
          of the Facebook Fan Page and on the basis of the GDPR, in order to
          obtain anonymized statistical data about Our users.
        </div>

        <div className="pb-2">
          For this purpose, Facebook places a Cookie on the device of the user
          visiting Our Facebook Fan Page. Each Cookie contains a unique
          identifier code and remains active for a period of two years, except
          when it is deleted before the end of this period.
        </div>

        <div className="pb-2">
          Facebook receives, records and processes the information stored in the
          Cookie, especially when the user visits the Facebook services,
          services that are provided by other members of the Facebook Fan Page
          and services by other companies that use Facebook services.
        </div>

        <div className="pb-2">
          For more information on the privacy practices of Facebook, please
          visit Facebook Privacy Policy here:
          https://www.facebook.com/full_data_use_policy
        </div>

        <div className="text-2xl font-bold pb-4">CCPA Privacy</div>
        <div className="text-xl font-bold pb-4">Your Rights under the CCPA</div>
        <div className="pb-2">
          Under this Privacy Policy, and by law if You are a resident of
          California, You have the following rights:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            The right to notice. You must be properly notified which categories
            of Personal Data are being collected and the purposes for which the
            Personal Data is being used.
          </li>
          <li className="pb-2">
            The right to access / the right to request. The CCPA permits You to
            request and obtain from the Company information regarding the
            disclosure of Your Personal Data that has been collected in the past
            12 months by the Company or its subsidiaries to a third-party for
            the third party’s direct marketing purposes.
          </li>
          <li className="pb-2">
            The right to say no to the sale of Personal Data. You also have the
            right to ask the Company not to sell Your Personal Data to third
            parties. You can submit such a request by visiting our "Do Not Sell
            My Personal Information" section or web page.
          </li>
          <li className="pb-2">
            The right to know about Your Personal Data. You have the right to
            request and obtain from the Company information regarding the
            disclosure of the following:
          </li>
          <ul className="py-2 px-6" style={{ listStyleType: "circle" }}>
            <li className="pb-2">The categories of Personal Data collected</li>
            <li className="pb-2">
              The sources from which the Personal Data was collected
            </li>
            <li className="pb-2">
              The business or commercial purpose for collecting or selling the
              Personal Data
            </li>
            <li className="pb-2">
              Categories of third parties with whom We share Personal Data
            </li>
            <li className="pb-2">
              The specific pieces of Personal Data we collected about You
            </li>
          </ul>
          <li className="pb-2">
            The right to delete Personal Data. You also have the right to
            request the deletion of Your Personal Data that have been collected
            in the past 12 months.
          </li>
          <li className="pb-2">
            The right not to be discriminated against. You have the right not to
            be discriminated against for exercising any of Your Consumer's
            rights, including by:
          </li>

          <ul className="py-2 px-6" style={{ listStyleType: "circle" }}>
            <li className="pb-2">Denying goods or services to You</li>
            <li className="pb-2">
              Charging different prices or rates for goods or services,
              including the use of discounts or other benefits or imposing
              penalties
            </li>
            <li className="pb-2">
              Providing a different level or quality of goods or services to You
            </li>
            <li className="pb-2">
              Suggesting that You will receive a different price or rate for
              goods or services or a different level or quality of goods or
              services.
            </li>
          </ul>
        </ul>
        <div className="text-xl font-bold pb-4">
          Exercising Your CCPA Data Protection Rights
        </div>
        <div className="pb-2">
          In order to exercise any of Your rights under the CCPA, and if you are
          a California resident, You can email or call us or visit our "Do Not
          Sell My Personal Information" section or web page.
        </div>

        <div className="pb-2">
          The Company will disclose and deliver the required information free of
          charge within 45 days of receiving Your verifiable request. The time
          period to provide the required information may be extended once by an
          additional 45 days when reasonable necessary and with prior notice.
        </div>

        <div className="text-xl font-bold pb-4">
          Do Not Sell My Personal Information
        </div>
        <div className="pb-2">
          We do not sell personal information. However, the Service Providers we
          partner with (for example, our advertising partners) may use
          technology on the Service that "sells" personal information as defined
          by the CCPA law.
        </div>

        <div className="pb-2">
          If you wish to opt out of the use of your personal information for
          interest-based advertising purposes and these potential sales as
          defined under CCPA law, you may do so by following the instructions
          below.
        </div>

        <div className="pb-2">
          Please note that any opt out is specific to the browser You use. You
          may need to opt out on every browser that you use.
        </div>

        <div className="text-xl font-bold pb-4">Website</div>
        <div className="pb-2">
          You can opt out of receiving ads that are personalized as served by
          our Service Providers by following our instructions presented on the
          Service:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">From Our "Cookie Consent" notice banner</li>
          <li className="pb-2">Or from Our "CCPA Opt-out" notice banner</li>
          <li className="pb-2">
            Or from Our "Do Not Sell My Personal Information" notice banner
          </li>
          <li className="pb-2">
            Or from Our "Do Not Sell My Personal Information" link
          </li>
        </ul>
        <div className="pb-2">
          The opt out will place a cookie on Your computer that is unique to the
          browser You use to opt out. If you change browsers or delete the
          cookies saved by your browser, you will need to opt out again.
        </div>

        <div className="text-xl font-bold pb-4">Mobile Devices</div>
        <div className="pb-2">
          Your mobile device may give you the ability to opt out of the use of
          information about the apps you use in order to serve you ads that are
          targeted to your interests:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            "Opt out of Interest-Based Ads" or "Opt out of Ads Personalization"
            on Android devices
          </li>
          <li className="pb-2">"Limit Ad Tracking" on iOS devices</li>
        </ul>
        <div className="pb-2">
          You can also stop the collection of location information from Your
          mobile device by changing the preferences on your mobile device.
        </div>

        <div className="text-2xl font-bold pb-4">
          "Do Not Track" Policy as Required by California Online Privacy
          Protection Act (CalOPPA)
        </div>
        <div className="pb-2">
          Our Service does not respond to Do Not Track signals.
        </div>

        <div className="pb-2">
          However, some third party websites do keep track of Your browsing
          activities. If You are visiting such websites, You can set Your
          preferences in Your web browser to inform websites that You do not
          want to be tracked. You can enable or disable DNT by visiting the
          preferences or settings page of Your web browser.
        </div>

        <div className="text-2xl font-bold pb-4">Children's Privacy</div>
        <div className="pb-2">
          The Service may contain content appropriate for children under the age
          of 13. As a parent, you should know that through the Service children
          under the age of 13 may participate in activities that involve the
          collection or use of personal information. We use reasonable efforts
          to ensure that before we collect any personal information from a
          child, the child's parent receives notice of and consents to our
          personal information practices.
        </div>

        <div className="pb-2">
          We also may limit how We collect, use, and store some of the
          information of Users between 13 and 18 years old. In some cases, this
          means We will be unable to provide certain functionality of the
          Service to these Users. If We need to rely on consent as a legal basis
          for processing Your information and Your country requires consent from
          a parent, We may require Your parent's consent before We collect and
          use that information.
        </div>

        <div className="pb-2">
          We may ask a User to verify its date of birth before collecting any
          personal information from them. If the User is under the age of 13,
          the Service will be either blocked or redirected to a parental consent
          process.
        </div>

        <div className="text-xl font-bold pb-4">
          Information Collected from Children Under the Age of 13
        </div>
        <div className="pb-2">
          The Company may collect and store persistent identifiers such as
          cookies or IP addresses from Children without parental consent for the
          purpose of supporting the internal operation of the Service.
        </div>

        <div className="pb-2">
          We may collect and store other personal information about children if
          this information is submitted by a child with prior parent consent or
          by the parent or guardian of the child.
        </div>

        <div className="pb-2">
          The Company may collect and store the following types of personal
          information about a child when submitted by a child with prior
          parental consent or by the parent or guardian of the child:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">First and/or last name</li>
          <li className="pb-2">Date of birth</li>
          <li className="pb-2">Gender</li>
          <li className="pb-2">Grade level</li>
          <li className="pb-2">Email address</li>
          <li className="pb-2">Telephone number</li>
          <li className="pb-2">Parent's or guardian's name</li>
          <li className="pb-2">Parent's or guardian's email address</li>
        </ul>
        <div className="pb-2">
          For further details on the information We might collect, You can refer
          to the "Types of Data Collected" section of this Privacy Policy. We
          follow our standard Privacy Policy for the disclosure of personal
          information collected from and about children.
        </div>

        <div className="text-xl font-bold pb-4">Parental Access</div>
        <div className="pb-2">
          A parent who has already given the Company permission to collect and
          use his child personal information can, at any time:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">
            Review, correct or delete the child's personal information
          </li>
          <li className="pb-2">
            Discontinue further collection or use of the child's personal
            information
          </li>
        </ul>
        <div className="pb-2">
          To make such a request, You can write to Us using the contact
          information provided in this Privacy Policy.
        </div>

        <div className="text-2xl font-bold pb-4">
          Your California Privacy Rights (California Business and Professions
          Code Section 22581)
        </div>
        <div className="pb-2">
          California Business and Professions Code section 22581 allow
          California residents under the age of 18 who are registered users of
          online sites, services or applications to request and obtain removal
          of content or information they have publicly posted.
        </div>

        <div className="pb-2">
          To request removal of such data, and if you are a California resident,
          You can contact Us using the contact information provided below, and
          include the email address associated with Your account.
        </div>

        <div className="pb-2">
          Be aware that Your request does not guarantee complete or
          comprehensive removal of content or information posted online and that
          the law may not permit or require removal in certain circumstances.
        </div>

        <div className="text-2xl font-bold pb-4">Links to Other Websites</div>
        <div className="pb-2">
          Our Service may contain links to other websites that are not operated
          by Us. If You click on a third party link, You will be directed to
          that third party's site. We strongly advise You to review the Privacy
          Policy of every site You visit.
        </div>

        <div className="pb-2">
          We have no control over and assume no responsibility for the content,
          privacy policies or practices of any third party sites or services.
        </div>

        <div className="text-2xl font-bold pb-4">
          Changes to this Privacy Policy
        </div>
        <div className="pb-2">
          We may update our Privacy Policy from time to time. We will notify You
          of any changes by posting the new Privacy Policy on this page.
        </div>

        <div className="pb-2">
          We will let You know via email and/or a prominent notice on Our
          Service, prior to the change becoming effective and update the "Last
          updated" date at the top of this Privacy Policy.
        </div>

        <div className="pb-2">
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </div>

        <div className="text-2xl font-bold pb-4">Contact Us</div>
        <div className="pb-2">
          If you have any questions about this Privacy Policy, You can contact
          us:
        </div>
        <ul className="list-disc p-4 mx-6">
          <li className="pb-2">By email: Info@IconoclastArtists.org</li>
          <li className="pb-2">
            By visiting this page on our website:
            https://iconoclastartists.org/
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Privacy;
