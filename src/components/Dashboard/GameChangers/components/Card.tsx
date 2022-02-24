import AnimatedMind from '@components/Dashboard/GameChangers/components/AnimatedMind';
import AnimatedFlower from '@components/Dashboard/GameChangers/components/AnimatedFlower';
import {
  SQUARE,
  THINK_ABOUT_IT,
} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import React from 'react';
import Button from './Button';

const BackgroundSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      width="818"
      height="618.16544"
      viewBox="0 0 818 618.16544"
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <path
        id="b901917b-4981-4312-adbf-d5b8f006e98e-26"
        data-name="Path 164"
        d="M575.40345,659.85339s10.411-17.08076,23.7774-6.98152,38.12,27.13918,38.12,27.13918,5.07,10.89909-8.05231,6.80521-55.95972-10.682-55.95972-10.682Z"
        transform="translate(-191 -140.91728)"
        fill="#feb8b8"
      />
      <path
        d="M284.45306,551.378c3.31771-26.67813,19.85136-52.96384,45.29423-61.64563a123.86326,123.86326,0,0,0,.00614,85.04047c3.90959,10.5753,9.35913,21.9305,5.68165,32.5888-2.28809,6.63189-7.88559,11.70587-14.14246,14.87849-6.25726,3.17263-13.20152,4.68476-20.05886,6.16664l-1.34957,1.11617C288.99826,604.94189,281.13536,578.05608,284.45306,551.378Z"
        transform="translate(-191 -140.91728)"
        fill="#f0f0f0"
      />
      <path
        d="M329.99977,490.23676a105.86975,105.86975,0,0,0-26.31905,59.58345,45.591,45.591,0,0,0,.5186,14.27516,26.14853,26.14853,0,0,0,6.50347,12.12823c2.93126,3.22058,6.30257,6.17543,8.39991,10.05247a16.01083,16.01083,0,0,1,.7822,13.07062c-1.85173,5.3111-5.50139,9.64009-9.21758,13.74946-4.12611,4.56266-8.48414,9.23647-10.23805,15.28536-.21251.7329-1.33731.3603-1.12512-.37149,3.0515-10.524,13.26755-16.50188,18.13956-25.98073,2.27336-4.423,3.22758-9.55792,1.09633-14.22685-1.86368-4.08278-5.3376-7.13282-8.33375-10.36808a27.90251,27.90251,0,0,1-6.80084-11.62187,42.14814,42.14814,0,0,1-1.06551-14.20255,102.71228,102.71228,0,0,1,7.50152-31.21348,107.7471,107.7471,0,0,1,19.3743-31.04834c.50661-.56729,1.28731.32506.784.88864Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M303.99965,542.64984a15.88383,15.88383,0,0,1-12.09073-16.6389c.06037-.76,1.24413-.70184,1.18368.05912a14.70809,14.70809,0,0,0,11.27854,15.45466c.74175.17636.366,1.30047-.37149,1.12512Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M309.00146,574.78639a30.61482,30.61482,0,0,0,13.67134-17.63188c.2151-.73212,1.34-.35975,1.12512.3715a31.844,31.844,0,0,1-14.26357,18.31864c-.657.38974-1.18635-.67064-.53289-1.05826Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M315.58107,510.14036a8.991,8.991,0,0,0,8.52044-.43252c.65176-.39787,1.18041.663.5329,1.05826a10.07515,10.07515,0,0,1-9.42484.49938.61234.61234,0,0,1-.37681-.7483.59543.59543,0,0,1,.74831-.37682Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M407.30075,537.38271c-.39991.26-.79981.52-1.2002.79a118.40679,118.40679,0,0,0-15.13965,11.81994c-.37011.33-.74023.67-1.1001,1.01a124.82713,124.82713,0,0,0-27.10986,37.11005,121.22249,121.22249,0,0,0-6.64014,17.18c-2.45019,8.13-4.46,17.14-9.31,23.79a20.79633,20.79633,0,0,1-1.62012,2H301.35055c-.09961-.05-.19971-.09-.2998-.14l-1.75.08c.07031-.31.1499-.63.22021-.94.04-.18.08984-.36.12988-.54.02979-.12.06006-.24.08008-.35.00977-.04.02-.07995.02979-.11.02-.11.05029-.21.07031-.31q.65991-2.685,1.35986-5.37c0-.01,0-.01.00977-.02,3.59033-13.63,8.3501-27.08,15-39.38.20019-.37.3999-.75.62012-1.12a115.67333,115.67333,0,0,1,10.39013-15.76,102.26239,102.26239,0,0,1,6.81006-7.79,85.03654,85.03654,0,0,1,21.27979-15.94c15.72021-8.3,33.91992-11.48,50.72021-6.41C406.45065,537.11275,406.87106,537.24269,407.30075,537.38271Z"
        transform="translate(-191 -140.91728)"
        fill="#f0f0f0"
      />
      <path
        d="M407.20221,537.939a105.86979,105.86979,0,0,0-56.88764,31.72816,45.591,45.591,0,0,0-8.18056,11.71015,26.14849,26.14849,0,0,0-2.10938,13.59926c.40144,4.33627,1.31422,8.72531.65458,13.08365a16.0108,16.0108,0,0,1-7.24487,10.9071c-4.67615,3.12574-10.19656,4.38486-15.63785,5.42855-6.0415,1.15883-12.33511,2.26677-17.37735,6.04049-.61094.45724-1.2847-.51746-.67468-.974,8.77264-6.56563,20.52866-5.18785,30.12561-9.82289,4.47811-2.1628,8.33157-5.68823,9.44091-10.69928.97007-4.38194.03267-8.90876-.41173-13.29581a27.90252,27.90252,0,0,1,1.56708-13.374,42.14783,42.14783,0,0,1,7.70016-11.98145,102.7127,102.7127,0,0,1,24.78221-20.40579,107.74722,107.74722,0,0,1,34.16255-13.12569c.746-.14793.83213,1.03459.091,1.18156Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M354.88627,564.134a15.88383,15.88383,0,0,1,.364-20.56468c.50574-.57044,1.41593.18867.90951.75986a14.70808,14.70808,0,0,0-.29949,19.13014c.48606.5874-.49073,1.25871-.974.67468Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M339.53151,592.80471a30.61477,30.61477,0,0,0,21.53141-5.847c.61254-.45506,1.28648.5195.67468.974a31.844,31.844,0,0,1-22.41775,6.03877c-.75924-.0844-.54345-1.24974.21166-1.16581Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M383.70634,545.14986a8.991,8.991,0,0,0,7.0635,4.78455c.75994.07473.54333,1.24-.21166,1.1658a10.07514,10.07514,0,0,1-7.82586-5.27567.61233.61233,0,0,1,.14967-.82435.59543.59543,0,0,1,.82435.14967Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M637.94537,728.19293c1.28579-10.33918,7.69345-20.52628,17.5539-23.89093a48.00357,48.00357,0,0,0,.00238,32.95766c1.51517,4.09848,3.62716,8.49922,2.20194,12.62987a10.73077,10.73077,0,0,1-5.481,5.7662,31.86955,31.86955,0,0,1-7.77386,2.3899l-.523.43257C639.70688,748.95177,636.65959,738.53211,637.94537,728.19293Z"
        transform="translate(-191 -140.91728)"
        fill="#f0f0f0"
      />
      <path
        d="M655.59712,704.4975a41.03016,41.03016,0,0,0-10.2,23.09172,17.66889,17.66889,0,0,0,.201,5.53237,10.13394,10.13394,0,0,0,2.52043,4.70034,20.97473,20.97473,0,0,1,3.25541,3.89585,6.2051,6.2051,0,0,1,.30315,5.06556,16.12189,16.12189,0,0,1-3.5723,5.32864c-1.59909,1.76827-3.288,3.57962-3.96779,5.92388-.08236.284-.51827.13964-.436-.144,1.18262-4.07861,5.14187-6.39534,7.03-10.06889a6.284,6.284,0,0,0,.42489-5.51366,16.2728,16.2728,0,0,0-3.22976-4.01817,10.81377,10.81377,0,0,1-2.63569-4.50409,16.33474,16.33474,0,0,1-.41294-5.50424,39.80662,39.80662,0,0,1,2.90723-12.09686,41.75748,41.75748,0,0,1,7.50857-12.03287c.19633-.21985.49889.126.30384.3444Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M645.5207,724.81033a6.15583,6.15583,0,0,1-4.68579-6.44845c.0234-.29453.48217-.272.45874.02291a5.70014,5.70014,0,0,0,4.371,5.98949c.28746.06835.14185.504-.144.43605Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M647.45917,737.26493a11.86483,11.86483,0,0,0,5.29836-6.83328c.08336-.28374.51931-.13942.43605.144a12.3412,12.3412,0,0,1-5.52789,7.09944c-.25463.151-.45977-.25991-.20652-.41013Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M650.00911,712.21119a3.4845,3.4845,0,0,0,3.30212-.16762c.25259-.1542.45747.25694.20653.41013a3.90469,3.90469,0,0,1-3.65262.19354.23732.23732,0,0,1-.146-.29.23076.23076,0,0,1,.29-.146Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M685.55532,722.769c-.155.10077-.31.20154-.46514.30619a45.88729,45.88729,0,0,0-5.86741,4.58085c-.14344.1279-.28688.25967-.42635.39143a48.37709,48.37709,0,0,0-10.5065,14.38209,46.98134,46.98134,0,0,0-2.5734,6.65816c-.94958,3.1508-1.72847,6.64263-3.60814,9.21986a8.0576,8.0576,0,0,1-.62788.77511H644.494c-.0386-.01937-.0774-.03489-.11619-.05426l-.67822.031c.02725-.12014.0581-.24416.08535-.3643.01551-.06976.03482-.13952.05033-.20927.01155-.04651.02328-.093.031-.13566.00378-.01549.00776-.031.01154-.04263.00776-.04262.01949-.08139.02725-.12014q.25575-1.04057.527-2.08115l.00378-.00776a69.07843,69.07843,0,0,1,5.81329-15.26182c.07759-.1434.155-.29067.24033-.43406a44.82908,44.82908,0,0,1,4.02673-6.10783,39.63,39.63,0,0,1,2.63925-3.019,32.95618,32.95618,0,0,1,8.247-6.17759c6.09241-3.21668,13.14575-4.4491,19.65675-2.4842C685.22586,722.66441,685.38879,722.71477,685.55532,722.769Z"
        transform="translate(-191 -140.91728)"
        fill="#f0f0f0"
      />
      <path
        d="M685.51713,722.98463a41.03009,41.03009,0,0,0-22.047,12.29633,17.6688,17.6688,0,0,0-3.17039,4.5383,10.13385,10.13385,0,0,0-.8175,5.27043,20.97427,20.97427,0,0,1,.25368,5.0706,6.205,6.205,0,0,1-2.80776,4.22708,16.12206,16.12206,0,0,1-6.06049,2.10385c-2.3414.4491-4.78051.87849-6.73464,2.341-.23677.17721-.49789-.20054-.26148-.37748,3.39987-2.54453,7.95594-2.01056,11.67526-3.80689a6.284,6.284,0,0,0,3.65885-4.14653,16.2724,16.2724,0,0,0-.15957-5.15283,10.81371,10.81371,0,0,1,.60733-5.18312,16.33455,16.33455,0,0,1,2.98422-4.64345,39.80641,39.80641,0,0,1,9.60441-7.90831,41.75755,41.75755,0,0,1,13.23978-5.0869c.28914-.05733.3225.401.03526.45792Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M665.242,733.13659a6.15582,6.15582,0,0,1,.14107-7.9699c.196-.22108.54874.07312.35248.29448a5.70016,5.70016,0,0,0-.11607,7.41394c.18838.22765-.19018.48782-.37748.26148Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M659.29117,744.248a11.86485,11.86485,0,0,0,8.34456-2.266c.23739-.17636.49857.20133.26147.37748a12.34123,12.34123,0,0,1-8.68806,2.34034c-.29424-.03271-.21062-.48434.082-.45181Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M676.41124,725.77921a3.48447,3.48447,0,0,0,2.73748,1.85427c.29452.029.21057.48058-.082.45181a3.90464,3.90464,0,0,1-3.03293-2.0446.23731.23731,0,0,1,.058-.31948.23076.23076,0,0,1,.31948.058Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M929.78833,508.57274c-5.09947-41.00555-30.51248-81.40792-69.61937-94.75224a190.38366,190.38366,0,0,1-.00943,130.71121c-6.00922,16.25473-14.38543,33.70821-8.733,50.09051,3.51689,10.19354,12.12051,17.99247,21.73762,22.869,9.61771,4.87648,20.29135,7.2007,30.83141,9.47841l2.07435,1.7156C922.80215,590.903,934.8878,549.57828,929.78833,508.57274Z"
        transform="translate(-191 -140.91728)"
        fill="#f0f0f0"
      />
      <path
        d="M859.78089,414.59585a162.72682,162.72682,0,0,1,40.45363,91.58257c.7108,7.293.79714,14.753-.79711,21.94158a40.19159,40.19159,0,0,1-9.99615,18.64168c-4.50548,4.95018-9.68734,9.49192-12.91105,15.45111-3.398,6.2813-3.52851,13.41814-1.20229,20.09016,2.8462,8.1634,8.45591,14.81727,14.16786,21.13356,6.342,7.013,13.04053,14.1969,15.73637,23.49432.32664,1.12651,2.05551.55381,1.72936-.571-4.6903-16.17592-20.39284-25.36416-27.88135-39.9336-3.49428-6.79837-4.961-14.691-1.68512-21.86734,2.86457-6.27543,8.20415-10.96348,12.80936-15.93622,4.83555-5.22145,8.5432-10.95033,10.45322-17.86337,1.95384-7.07165,2.159-14.55079,1.63774-21.83a157.874,157.874,0,0,0-11.53019-47.97659A165.61221,165.61221,0,0,0,860.986,413.23c-.77868-.87195-1.97865.49963-1.20506,1.36588Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M899.7443,495.15723a24.4142,24.4142,0,0,0,18.584-25.57478c-.09279-1.16808-1.9123-1.07876-1.81938.09087a22.607,22.607,0,0,1-17.33565,23.75455c-1.1401.27106-.56257,1.99887.571,1.72936Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M892.05629,544.55261a47.05643,47.05643,0,0,1-21.0135-27.101c-.33061-1.12532-2.05957-.553-1.72936.571a48.94577,48.94577,0,0,0,21.92378,28.15662c1.00987.599,1.82347-1.03081.81908-1.6266Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M881.94312,445.18863a13.81961,13.81961,0,0,1-13.09632-.66481c-1.00178-.61154-1.81435,1.019-.81909,1.6266a15.48606,15.48606,0,0,0,14.48642.76757.9412.9412,0,0,0,.57918-1.15018.9152.9152,0,0,0-1.15019-.57918Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M740.96566,487.06139c.61467.39965,1.22934.7993,1.84476,1.21433a181.99647,181.99647,0,0,1,23.27035,18.16781c.56889.50725,1.13777,1.02989,1.6909,1.55243a191.86544,191.86544,0,0,1,41.66914,57.03989,186.32475,186.32475,0,0,1,10.2062,26.40646c3.76606,12.4962,6.85517,26.34492,14.31,36.56632a31.965,31.965,0,0,0,2.49019,3.07409h67.3689c.1531-.07683.307-.13838.46081-.21521l2.68983.123c-.10807-.47648-.23041-.96835-.33848-1.44483-.06154-.27665-.13809-.55331-.19963-.83-.04579-.18444-.09232-.369-.12309-.538-.015-.06145-.03077-.1229-.04578-.169-.03077-.16906-.0773-.32282-.10807-.47649q-1.01432-4.12692-2.09018-8.25393c0-.01539,0-.01539-.015-.03077-5.51851-20.95-12.83449-41.62326-23.0557-60.52892-.30771-.5687-.61467-1.15279-.95315-1.72149a177.7967,177.7967,0,0,0-15.97013-24.22387,157.18141,157.18141,0,0,0-10.46738-11.97357,130.70544,130.70544,0,0,0-32.708-24.50053c-24.16271-12.75747-52.13652-17.64527-77.95936-9.85243C742.2723,486.64645,741.62611,486.84618,740.96566,487.06139Z"
        transform="translate(-191 -140.91728)"
        fill="#f0f0f0"
      />
      <path
        d="M741.11711,487.91644a162.72682,162.72682,0,0,1,87.439,48.76768c4.95843,5.39511,9.51883,11.29955,12.5739,17.999a40.19159,40.19159,0,0,1,3.24221,20.9027c-.617,6.665-2.02,13.41122-1.00611,20.11019,1.06869,7.06108,5.26132,12.838,11.1357,16.76474,7.18747,4.80441,15.67259,6.73972,24.03611,8.34393,9.28608,1.78118,18.95964,3.48413,26.70981,9.28452.939.7028,1.97464-.79537,1.037-1.49711-13.484-10.09168-31.55352-7.974-46.30449-15.09824-6.88307-3.32432-12.806-8.74308-14.51112-16.44529-1.491-6.73525-.05022-13.69319.63285-20.4363.71725-7.08037.22841-13.88682-2.40867-20.55646-2.69759-6.82266-7.03676-12.91784-11.83551-18.41605a157.87389,157.87389,0,0,0-38.09144-31.36466,165.61214,165.61214,0,0,0-52.50943-20.1748c-1.14671-.22739-1.279,1.59021-.13982,1.81611Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M821.52917,528.17946a24.41421,24.41421,0,0,0-.55948-31.6089c-.77735-.87678-2.17635.29-1.398,1.168a22.607,22.607,0,0,1,.46033,29.40393c-.7471.90285.75428,1.9347,1.49711,1.037Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M845.13016,572.24762a47.0564,47.0564,0,0,1-33.09479-8.98707c-.9415-.69945-1.97738.7985-1.037,1.4971a48.94577,48.94577,0,0,0,34.45714,9.28187c1.167-.12972.83532-1.92091-.32533-1.7919Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M777.23138,498.99987a13.81964,13.81964,0,0,1-10.85695,7.35408c-1.168.11486-.83512,1.906.32534,1.79189a15.486,15.486,0,0,0,12.02872-8.109.9412.9412,0,0,0-.23005-1.26706.9152.9152,0,0,0-1.26706.23005Z"
        transform="translate(-191 -140.91728)"
        fill="#fff"
      />
      <path
        d="M1008.32677,632.08272H192a1,1,0,0,1,0-2h816a1,1,0,0,1,1,1C1009,631.635,1008.879,632.08272,1008.32677,632.08272Z"
        transform="translate(-191 -140.91728)"
        fill="#cacaca"
      />
      <path
        d="M477.32677,720.08272H297a1,1,0,0,1,0-2H477a1,1,0,0,1,1,1C478,719.635,477.879,720.08272,477.32677,720.08272Z"
        transform="translate(-191 -140.91728)"
        fill="#cacaca"
      />
      <path
        d="M760.32677,759.08272H580a1,1,0,0,1,0-2H760a1,1,0,0,1,1,1C761,758.635,760.879,759.08272,760.32677,759.08272Z"
        transform="translate(-191 -140.91728)"
        fill="#cacaca"
      />
      <path
        d="M930.32677,719.08272H750a1,1,0,0,1,0-2H930a1,1,0,0,1,1,1C931,718.635,930.879,719.08272,930.32677,719.08272Z"
        transform="translate(-191 -140.91728)"
        fill="#cacaca"
      />
      <path
        id="ea820f77-130a-433d-b966-41522e2706cd-27"
        data-name="Path 161"
        d="M524.25844,681.08272c-11.20193,0-21.45715-1.07341-29.60526-3.61051-9.685-3.01573-15.76614-7.89257-18.07653-14.50579a17.07942,17.07942,0,0,1,2.67718-16.93257c14.32749-18.66895,64.04638-23.93456,70.71748-24.55688l13.534-25.62736c.86594-6.11459-3.23112-10.74353,3.84747-10.85907l83.73483-1.13725c6.95181-.14609,4.97878,4.15882,6.16918,10.12067l12.75751,22.77411-54.90637,23.173,8.30143,20.22834-.54178.31475C606.79809,669.78557,560.585,681.0813,524.25844,681.08272Z"
        transform="translate(-191 -140.91728)"
        fill="#2f2e41"
      />
      <path
        id="e2cf09bf-0dcf-4d32-bd8b-d83345e69099-28"
        data-name="Path 162"
        d="M662.413,617.72025s76.68026-8.7752,71.67937,26.32559-63.34456,59.96384-151.69355,0l10.00178-17.55039s32.92262-1.63753,52.92616-10.41273Z"
        transform="translate(-191 -140.91728)"
        fill="#2f2e41"
      />
      <path
        id="e394c6e3-5a9b-4b6a-ab2c-d395b6ec401d-29"
        data-name="Path 166"
        d="M553.85367,458.70041s-14.574-2.64983-18.54879,19.8737-10.34172,75.87629-10.34172,75.87629l-19.76907,68.53379a13.91157,13.91157,0,1,0,19.8154,8.184l26.45194-72.73778,5.04207-62.62715V462.98786A4.79351,4.79351,0,0,0,553.85367,458.70041Z"
        transform="translate(-191 -140.91728)"
        fill="#feb8b8"
      />
      <path
        id="bce87157-538b-4a9f-a71d-b40a66ba2871-30"
        data-name="Path 166"
        d="M656.43781,458.70041s14.574-2.64983,18.54879,19.8737,10.34172,75.87629,10.34172,75.87629l19.76906,68.53379a13.91157,13.91157,0,1,1-19.8154,8.184L658.83005,558.4304,653.788,495.80325V462.98786A4.79351,4.79351,0,0,1,656.43781,458.70041Z"
        transform="translate(-191 -140.91728)"
        fill="#feb8b8"
      />
      <path
        d="M655.32677,440.08272l-27.56706-10.31049-53.43294-.68951-23,11,6.45988,37.1261s-13.04267,22.08471,1.3177,44.17207l3.22242,78.70183s51.51613,29.87333,95-6L647.49869,520.909s16.43881-33.95016,3.697-46.5629Z"
        transform="translate(-191 -140.91728)"
        fill="#6c63ff"
      />
      <path
        d="M644.09876,451.61981l11.228-11.53709s24.50483,12.88946,24,56l-30.91144-9.5265Z"
        transform="translate(-191 -140.91728)"
        fill="#6c63ff"
      />
      <path
        d="M563.80047,451.61981l-11.92928-11.92928s-21.04924,16.28165-20.54442,59.39219l28.15714-12.5265Z"
        transform="translate(-191 -140.91728)"
        fill="#6c63ff"
      />
      <path
        id="fa495a93-2d48-4158-a295-a9de2db8cd68-31"
        data-name="Path 163"
        d="M641.56372,651.325s-8.58646-18.06695-22.92671-9.406-40.72514,23.04621-40.72514,23.04621-6.17132,10.31554,7.30438,7.6024,56.765-4.83026,56.765-4.83026Z"
        transform="translate(-191 -140.91728)"
        fill="#feb8b8"
      />
      <path
        d="M617.70831,328.36615c.12124-.11656.24819-.22114.36787-.34069,7.67323-7.67329,9.22848-18.55913,3.47317-24.31411-5.43844-5.43869-15.45573-4.34107-23.01708,2.27147-6.48325-6.17228-15.17631-7.893-20.8031-3.63212-6.48845,4.91329-6.438,15.90951.11343,24.56075.44852.59239.91942,1.15245,1.4028,1.69138A45.30686,45.30686,0,0,0,549.512,371.14925v43.12008a9.6285,9.6285,0,0,0,9.62861,9.62841h79.69551a9.30546,9.30546,0,0,0,9.30548-9.30536V371.14925A45.29851,45.29851,0,0,0,617.70831,328.36615Z"
        transform="translate(-191 -140.91728)"
        fill="#2f2e41"
      />
      <circle
        cx="600.08557"
        cy="381.7779"
        r="37.81786"
        transform="translate(-285.19675 395.22746) rotate(-45)"
        fill="#ffb6b6"
      />
      <path
        d="M560.34781,357.99058a51.4352,51.4352,0,0,0,29.39489,9.0843,31.52,31.52,0,0,1-12.49293,5.13969,103.71562,103.71562,0,0,0,42.36464.238,27.419,27.419,0,0,0,8.86862-3.046,11.22364,11.22364,0,0,0,5.47414-7.32107c.92947-5.30985-3.208-10.134-7.50784-13.38517a55.38076,55.38076,0,0,0-46.53814-9.29961c-5.19861,1.34378-10.40644,3.6142-13.78308,7.78908s-4.37686,10.61119-1.15978,14.91022Z"
        transform="translate(-191 -140.91728)"
        fill="#2f2e41"
      />
      <polygon
        points="200.519 165.172 200.519 165.172 200.519 165.172 200.519 165.172"
        fill="#f2f2f2"
      />
      <path
        d="M358.06951,282.52385l1.19182-1.60663,31.74906,23.54992c-1.72543-5.25857-7.83252-21.92876-17.84388-28.58027-11.96018-7.94608-20.37487-5.47432-24.95933,1.42589s-3.60278,15.61518,8.3575,23.56174c10.1382,6.736,28.19877,5.7994,33.468,5.35779Z"
        transform="translate(-191 -140.91728)"
        fill="#f2f2f2"
      />
      <polygon
        points="617.85 43.489 617.85 43.489 617.85 43.489 617.85 43.489"
        fill="#f2f2f2"
      />
      <path
        d="M835.76714,153.58938l1.474,1.35247-26.72442,29.12742c5.40952-1.16912,22.62449-5.50922,30.28121-14.77446,9.147-11.06884,7.56382-19.695,1.17786-24.97226s-15.15576-5.20737-24.30321,5.86151c-7.75391,9.38261-8.7009,27.44264-8.80973,32.72918Z"
        transform="translate(-191 -140.91728)"
        fill="#f2f2f2"
      />
      <polygon
        points="186.85 354.489 186.85 354.489 186.85 354.489 186.85 354.489"
        fill="#f2f2f2"
      />
      <path
        d="M404.76714,464.58938l1.474,1.35247-26.72442,29.12742c5.40952-1.16912,22.62449-5.50922,30.28121-14.77446,9.147-11.06884,7.56382-19.695,1.17786-24.97226s-15.15576-5.20737-24.30321,5.86151c-7.75391,9.38261-8.7009,27.44264-8.80973,32.72918Z"
        transform="translate(-191 -140.91728)"
        fill="#f2f2f2"
      />
      <polygon
        points="420.124 81.956 420.124 81.956 420.124 81.956 420.124 81.956"
        fill="#f2f2f2"
      />
      <path
        d="M630.74409,186.96735l1.73143,1.00194-19.79764,34.21484c5.029-2.31063,20.89909-10.26874,26.37239-20.96981,6.53853-12.78412,3.12848-20.86422-4.2471-24.63663s-15.923-1.80875-22.462,10.97552c-5.54284,10.83667-2.56422,28.67453-1.52792,33.85965Z"
        transform="translate(-191 -140.91728)"
        fill="#f2f2f2"
      />
      <polygon
        points="605.124 295.956 605.124 295.956 605.124 295.956 605.124 295.956"
        fill="#f2f2f2"
      />
      <path
        d="M815.74409,400.96735l1.73143,1.00194-19.79764,34.21484c5.029-2.31063,20.89909-10.26874,26.37239-20.96981,6.53853-12.78412,3.12848-20.86422-4.2471-24.63663s-15.923-1.80875-22.462,10.97552c-5.54284,10.83667-2.56422,28.67453-1.52792,33.85965Z"
        transform="translate(-191 -140.91728)"
        fill="#f2f2f2"
      />
    </svg>
  );
};

const Card = ({
  card,
  onClick,
  selected,
}: {
  card?: {id: number; type: string; title: string; desc: string};
  onClick: (id: number) => void;
  selected: boolean;
}) => {
  const circularClass = ' rounded-full border-8 border-teal-600';

  const focusIcon = (
    <div className={`${circularClass}  main_circle h-32 w-32`}>
      <div className={`${circularClass} h-28 w-28`}>
        <div className={`${circularClass} h-24 w-24`}>
          <div className={`${circularClass} h-20 w-20`}>
            <div className={`${circularClass} main_circle  h-16 w-16`}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`carousel-cell box mx-6 z-100  cursor-pointer  h-156 w-84  transition-all  flex flex-col items-center justify-center overflow-hidden form-button`}>
      <div
        style={{
          background: 'rgba(21, 19, 21, .8)',
        }}
        className={`h-full inner-card transition-all rounded-xl px-8 py-16  flex flex-col border-gray-900 border-2 items-center justify-center overflow-hidden `}>
        {card.type === SQUARE ? (
          focusIcon
        ) : card.type === THINK_ABOUT_IT ? (
          <AnimatedMind />
        ) : (
          <AnimatedFlower />
        )}
        <h1 className="text-4xl my-4  text-white font-bold">{card.title}</h1>
        <p className="text-base my-2 text-white font-light">{card.desc}</p>
      </div>

      <Button
        onClick={() => onClick(card.id)}
        text={`Select ${card.type !== THINK_ABOUT_IT ? 'Exercise' : ''}`}
      />
    </div>
  );
};

export default Card;
