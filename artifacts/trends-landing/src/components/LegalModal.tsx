import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Shield, AlertTriangle, ScrollText } from "lucide-react";

export type DocId = "terms" | "privacy" | "risks" | "offer";

interface Doc {
  id: DocId;
  icon: React.ElementType;
  accent: string;
  titleRu: string;
  titleEn: string;
  contentRu: React.ReactNode;
  contentEn: React.ReactNode;
}

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{children}</p>
);
const H = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-bold text-foreground mt-6 mb-2">{children}</h3>
);
const UL = ({ items }: { items: string[] }) => (
  <ul className="list-disc pl-5 mb-4 space-y-1">
    {items.map((it, i) => <li key={i} className="text-sm text-muted-foreground leading-relaxed">{it}</li>)}
  </ul>
);

export const DOCS: Doc[] = [
  {
    id: "terms",
    icon: FileText,
    accent: "text-primary",
    titleRu: "Пользовательское соглашение",
    titleEn: "Terms of Service",
    contentRu: (
      <div>
        <P>Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между Trends Platform (далее — «Платформа», «Мы») и физическим лицом, получающим доступ к сервисам Платформы (далее — «Пользователь»).</P>
        <P>Дата последнего обновления: 17 мая 2026 г.</P>
        <H>1. Общие положения</H>
        <P>1.1. Использование Платформы означает полное и безоговорочное принятие условий настоящего Соглашения.</P>
        <P>1.2. Платформа оставляет за собой право в одностороннем порядке изменять условия Соглашения с уведомлением Пользователей через официальные каналы не менее чем за 5 рабочих дней.</P>
        <P>1.3. Платформа функционирует как технологическая среда для размещения вертикального видеоконтента внутри экосистемы Telegram.</P>
        <H>2. Регистрация и учётная запись</H>
        <P>2.1. Для получения доступа к инвестиционным функциям Пользователь обязан пройти регистрацию и предоставить достоверные данные.</P>
        <P>2.2. Пользователь несёт ответственность за сохранность учётных данных и все действия, совершённые с его аккаунта.</P>
        <P>2.3. Регистрация доступна лицам, достигшим 18 лет. Участие в инвестиционной программе доступно только дееспособным физическим лицам.</P>
        <H>3. Инвестиционная программа</H>
        <P>3.1. Инвестиционная программа Trends предполагает приобретение Пакета участия (Starter $250, Partner $1 000, Insider $5 000, Visionary $25 000, Co-Investor $100 000) на условиях, определённых в Инвестиционной оферте.</P>
        <P>3.2. Доходность программы RevShare не является гарантированной и зависит от фактических показателей монетизации Платформы.</P>
        <P>3.3. Участие в реферальной программе регулируется отдельными условиями MLM-структуры, изложенными в Инвестиционной оферте.</P>
        <H>4. Запрещённые действия</H>
        <UL items={[
          "Предоставление заведомо ложных сведений при регистрации",
          "Использование Платформы в целях отмывания денег или финансирования незаконной деятельности",
          "Многократная регистрация для получения реферального бонуса",
          "Распространение дезинформации о Платформе и её продуктах",
          "Нарушение авторских прав третьих лиц при размещении контента",
        ]} />
        <H>5. Интеллектуальная собственность</H>
        <P>5.1. Все права на товарный знак Trends, фирменный стиль, программный код и алгоритмы принадлежат Trends Platform.</P>
        <P>5.2. Контент, размещаемый авторами, остаётся их собственностью; авторы предоставляют Платформе неисключительную лицензию на использование в рамках сервиса.</P>
        <H>6. Ограничение ответственности</H>
        <P>6.1. Платформа не несёт ответственности за убытки, возникшие вследствие инвестиционных решений Пользователя.</P>
        <P>6.2. Совокупная ответственность Платформы перед Пользователем ограничена суммой фактически внесённых инвестиций.</P>
        <H>7. Применимое право</H>
        <P>Настоящее Соглашение регулируется и толкуется в соответствии с законодательством Российской Федерации. Споры разрешаются в претензионном порядке, при недостижении соглашения — в судебном порядке по месту нахождения Платформы.</P>
        <H>8. Контакты</H>
        <P>По вопросам, связанным с настоящим Соглашением: support@trends-platform.app · Telegram: @Trends_ibot</P>
      </div>
    ),
    contentEn: (
      <div>
        <P>This Terms of Service Agreement ("Agreement") governs the relationship between Trends Platform ("Platform", "We") and any individual accessing the Platform's services ("User").</P>
        <P>Last updated: May 17, 2026</P>
        <H>1. General Provisions</H>
        <P>1.1. Using the Platform constitutes full and unconditional acceptance of this Agreement.</P>
        <P>1.2. The Platform reserves the right to modify these Terms unilaterally, with at least 5 business days' notice via official channels.</P>
        <P>1.3. The Platform operates as a technology environment for hosting vertical video content within the Telegram ecosystem.</P>
        <H>2. Registration and Account</H>
        <P>2.1. To access investment features, Users must register and provide accurate information.</P>
        <P>2.2. Users are responsible for keeping their credentials secure and for all actions taken from their account.</P>
        <P>2.3. Registration is available to persons aged 18 and over. Participation in the investment program is available only to legally capable individuals.</P>
        <H>3. Investment Program</H>
        <P>3.1. The Trends Investment Program involves purchasing a participation package (Starter $250, Partner $1,000, Insider $5,000, Visionary $25,000, Co-Investor $100,000) under the terms defined in the Investment Offer.</P>
        <P>3.2. RevShare program returns are not guaranteed and depend on the Platform's actual monetization performance.</P>
        <P>3.3. Participation in the referral program is governed by the MLM structure terms set out in the Investment Offer.</P>
        <H>4. Prohibited Actions</H>
        <UL items={[
          "Providing false information during registration",
          "Using the Platform for money laundering or financing illegal activities",
          "Multiple registrations to obtain referral bonuses",
          "Spreading disinformation about the Platform and its products",
          "Violating third-party intellectual property rights when posting content",
        ]} />
        <H>5. Intellectual Property</H>
        <P>5.1. All rights to the Trends trademark, brand identity, source code and algorithms belong to Trends Platform.</P>
        <P>5.2. Content posted by creators remains their property; creators grant the Platform a non-exclusive license to use it within the service.</P>
        <H>6. Limitation of Liability</H>
        <P>6.1. The Platform is not liable for losses arising from the User's investment decisions.</P>
        <P>6.2. The Platform's total liability to a User is limited to the amount of funds actually invested.</P>
        <H>7. Governing Law</H>
        <P>This Agreement is governed by applicable law. Disputes shall be resolved through negotiation; failing that, through competent courts.</P>
        <H>8. Contact</H>
        <P>For matters related to this Agreement: support@trends-platform.app · Telegram: @Trends_ibot</P>
      </div>
    ),
  },
  {
    id: "privacy",
    icon: Shield,
    accent: "text-secondary",
    titleRu: "Политика конфиденциальности",
    titleEn: "Privacy Policy",
    contentRu: (
      <div>
        <P>Настоящая Политика конфиденциальности описывает, какие персональные данные собирает Trends Platform, как они используются, хранятся и защищаются.</P>
        <P>Дата последнего обновления: 17 мая 2026 г.</P>
        <H>1. Какие данные мы собираем</H>
        <UL items={[
          "Идентификационные данные: имя, Telegram ID, адрес электронной почты",
          "Финансовые данные: адрес USDT-кошелька, история инвестиций и выплат",
          "Поведенческие данные: просмотры, лайки, время сессий (агрегированно, анонимизированно)",
          "Технические данные: IP-адрес, тип устройства, версия Telegram Mini App",
        ]} />
        <H>2. Цели обработки данных</H>
        <UL items={[
          "Идентификация и авторизация Пользователя",
          "Расчёт и выплата RevShare вознаграждений",
          "Управление реферальной структурой (MLM)",
          "Улучшение алгоритмов рекомендаций на основе агрегированных данных",
          "Соблюдение требований законодательства об AML/KYC",
          "Направление транзакционных и сервисных уведомлений",
        ]} />
        <H>3. Правовые основания обработки</H>
        <P>3.1. Исполнение договора (Инвестиционная оферта, настоящее Соглашение).</P>
        <P>3.2. Выполнение правовых обязательств (налоговое и антиотмывочное законодательство).</P>
        <P>3.3. Согласие Пользователя — для маркетинговых коммуникаций (может быть отозвано в любой момент).</P>
        <H>4. Передача данных третьим лицам</H>
        <P>Мы не продаём персональные данные. Передача возможна только в следующих случаях: по требованию уполномоченных государственных органов; платёжным провайдерам для проведения транзакций; технологическим партнёрам — исключительно в объёме, необходимом для оказания услуг, на основании соглашений о конфиденциальности.</P>
        <H>5. Хранение данных</H>
        <P>Данные хранятся в течение срока действия аккаунта + 5 лет после его закрытия (требования финансового законодательства). Поведенческие данные анонимизируются через 12 месяцев.</P>
        <H>6. Права пользователя</H>
        <UL items={[
          "Право на доступ к своим данным (запрос через support@trends-platform.app)",
          "Право на исправление неточных данных",
          "Право на удаление данных (при отсутствии правовых оснований для хранения)",
          "Право на переносимость данных",
          "Право на отзыв согласия на маркетинговые коммуникации",
        ]} />
        <H>7. Безопасность</H>
        <P>Данные хранятся на серверах с шифрованием AES-256. Доступ к финансовым данным защищён двухфакторной аутентификацией. Мы проводим регулярный аудит безопасности.</P>
        <H>8. Файлы cookie</H>
        <P>Платформа использует технические cookie, необходимые для работы сервиса, и аналитические cookie (агрегированно, без идентификации личности). Маркетинговые cookie применяются только с согласия Пользователя.</P>
        <H>9. Контакты DPO</H>
        <P>По вопросам обработки персональных данных: privacy@trends-platform.app</P>
      </div>
    ),
    contentEn: (
      <div>
        <P>This Privacy Policy describes what personal data Trends Platform collects, and how it is used, stored and protected.</P>
        <P>Last updated: May 17, 2026</P>
        <H>1. Data We Collect</H>
        <UL items={[
          "Identity data: name, Telegram ID, email address",
          "Financial data: USDT wallet address, investment and payout history",
          "Behavioral data: views, likes, session duration (aggregated, anonymized)",
          "Technical data: IP address, device type, Telegram Mini App version",
        ]} />
        <H>2. Purposes of Processing</H>
        <UL items={[
          "User identification and authentication",
          "Calculation and payment of RevShare rewards",
          "Referral structure (MLM) management",
          "Improving recommendation algorithms using aggregated data",
          "Compliance with AML/KYC legislation",
          "Sending transactional and service notifications",
        ]} />
        <H>3. Legal Basis for Processing</H>
        <P>3.1. Performance of contract (Investment Offer, this Agreement).</P>
        <P>3.2. Compliance with legal obligations (tax and anti-money-laundering legislation).</P>
        <P>3.3. User consent — for marketing communications (may be withdrawn at any time).</P>
        <H>4. Sharing with Third Parties</H>
        <P>We do not sell personal data. Transfer is only possible: upon request from competent authorities; to payment providers for transaction processing; to technology partners — strictly to the extent necessary for service provision, under confidentiality agreements.</P>
        <H>5. Data Retention</H>
        <P>Data is retained for the duration of the account + 5 years after closure (financial legislation requirements). Behavioral data is anonymized after 12 months.</P>
        <H>6. User Rights</H>
        <UL items={[
          "Right of access to your data (request via privacy@trends-platform.app)",
          "Right to rectification of inaccurate data",
          "Right to erasure (where no legal basis for retention exists)",
          "Right to data portability",
          "Right to withdraw consent for marketing communications",
        ]} />
        <H>7. Security</H>
        <P>Data is stored on AES-256 encrypted servers. Access to financial data is protected by two-factor authentication. We conduct regular security audits.</P>
        <H>8. Cookies</H>
        <P>The Platform uses technical cookies necessary for the service and analytics cookies (aggregated, non-identifying). Marketing cookies are only used with User consent.</P>
        <H>9. DPO Contact</H>
        <P>For data processing inquiries: privacy@trends-platform.app</P>
      </div>
    ),
  },
  {
    id: "risks",
    icon: AlertTriangle,
    accent: "text-yellow-400",
    titleRu: "Уведомление о рисках",
    titleEn: "Risk Disclosure",
    contentRu: (
      <div>
        <P>Перед принятием инвестиционного решения внимательно ознакомьтесь с настоящим Уведомлением о рисках. Инвестирование в проекты ранних стадий сопряжено с существенными рисками потери вложенных средств.</P>
        <H>1. Рыночные риски</H>
        <P>1.1. Рынок социальных медиа и видеоконтента высококонкурентен. Существуют риски изменения потребительских предпочтений, выхода на рынок новых игроков и изменения алгоритмов Telegram.</P>
        <P>1.2. Доходность RevShare зависит от объёма рекламного рынка, который подвержен циклическим колебаниям.</P>
        <H>2. Риски ранней стадии</H>
        <P>2.1. Trends находится на стадии Pre-Seed. Продукт имеет работающий MVP, однако до достижения операционной прибыли требуется масштабирование.</P>
        <P>2.2. Прогнозируемые показатели (DAU, выручка, оценка компании) являются ожидаемыми, а не гарантированными. Фактические результаты могут существенно отличаться.</P>
        <H>3. Риски ликвидности</H>
        <P>3.1. Инвестиции не являются публично торгуемыми ценными бумагами. Отсутствует гарантированная возможность досрочного выхода из инвестиции.</P>
        <P>3.2. Выплаты RevShare начинаются только после запуска монетизации и могут быть отложены при недостижении плановых показателей.</P>
        <H>4. Технологические риски</H>
        <UL items={[
          "Изменения в политике Telegram Mini Apps могут повлиять на функциональность платформы",
          "Риски кибербезопасности: взломы, DDoS-атаки, утечки данных",
          "Технические сбои в инфраструктуре, влияющие на доступность сервиса",
          "Риски масштабирования при резком росте аудитории",
        ]} />
        <H>5. Регуляторные риски</H>
        <P>5.1. Законодательство в области краудфандинга и MLM-структур различается в разных юрисдикциях и может меняться. Участие в программе может быть ограничено в отдельных странах.</P>
        <P>5.2. Токен $TRND на момент листинга будет классифицирован в соответствии с актуальным законодательством о криптоактивах. Регуляторные изменения могут повлиять на стоимость и оборот токена.</P>
        <H>6. Риски контрагента</H>
        <P>6.1. Платформа не является банком или лицензированным финансовым институтом. Инвестиции не застрахованы государственными системами страхования вкладов.</P>
        <H>7. Диверсификация</H>
        <P>Настоятельно рекомендуем инвестировать только те средства, потерю которых вы можете позволить себе без ущерба для финансового благополучия. Не рекомендуется вкладывать в Trends более 5–10% своего инвестиционного портфеля.</P>
        <H>8. Независимая консультация</H>
        <P>Перед принятием решения рекомендуем проконсультироваться с независимым финансовым советником. Настоящий материал не является инвестиционной рекомендацией.</P>
      </div>
    ),
    contentEn: (
      <div>
        <P>Before making an investment decision, please read this Risk Disclosure carefully. Investing in early-stage projects carries substantial risk of loss of capital.</P>
        <H>1. Market Risks</H>
        <P>1.1. The social media and video content market is highly competitive. There are risks of changing consumer preferences, new market entrants, and changes to Telegram's algorithms.</P>
        <P>1.2. RevShare returns depend on advertising market volumes, which are subject to cyclical fluctuations.</P>
        <H>2. Early-Stage Risks</H>
        <P>2.1. Trends is at the Pre-Seed stage. The product has a working MVP, but scaling is required before reaching operating profit.</P>
        <P>2.2. Projected metrics (DAU, revenue, company valuation) are expected, not guaranteed. Actual results may differ materially.</P>
        <H>3. Liquidity Risks</H>
        <P>3.1. Investments are not publicly traded securities. There is no guaranteed ability to exit early.</P>
        <P>3.2. RevShare payments begin only after monetization launches and may be delayed if planned metrics are not reached.</P>
        <H>4. Technology Risks</H>
        <UL items={[
          "Changes in Telegram Mini Apps policy may affect platform functionality",
          "Cybersecurity risks: hacks, DDoS attacks, data breaches",
          "Infrastructure failures affecting service availability",
          "Scaling risks during rapid audience growth",
        ]} />
        <H>5. Regulatory Risks</H>
        <P>5.1. Legislation on crowdfunding and MLM structures varies across jurisdictions and may change. Participation may be restricted in certain countries.</P>
        <P>5.2. The $TRND token at listing will be classified in accordance with applicable crypto-asset legislation. Regulatory changes may affect the token's value and circulation.</P>
        <H>6. Counterparty Risks</H>
        <P>6.1. The Platform is not a bank or licensed financial institution. Investments are not covered by government deposit insurance schemes.</P>
        <H>7. Diversification</H>
        <P>We strongly recommend investing only funds whose loss you can afford without harming your financial wellbeing. We recommend allocating no more than 5–10% of your investment portfolio to Trends.</P>
        <H>8. Independent Advice</H>
        <P>Before making a decision, we recommend consulting an independent financial advisor. This material does not constitute investment advice.</P>
      </div>
    ),
  },
  {
    id: "offer",
    icon: ScrollText,
    accent: "text-green-400",
    titleRu: "Инвестиционная оферта",
    titleEn: "Investment Offer",
    contentRu: (
      <div>
        <P>Настоящая Инвестиционная оферта (далее — «Оферта») является публичным предложением Trends Platform (далее — «Компания») о заключении договора участия в инвестиционной программе на условиях, изложенных ниже.</P>
        <P>Принятие (акцепт) Оферты осуществляется путём оплаты любого из инвестиционных пакетов на Платформе.</P>
        <H>1. Инвестиционные пакеты</H>
        <UL items={[
          "Starter — $250: базовый доступ к RevShare пулу, реферальная программа до 3 уровней",
          "Partner — $1 000: расширенный RevShare, закрытый канал инвесторов, реферальная программа 5 уровней",
          "Insider — $5 000: полный RevShare (все 7 источников монетизации), прямой доступ к команде, рекламный баланс $10 000",
          "Visionary — $25 000: максимальный RevShare, Advisory Board, персональный менеджер, рекламный баланс $50 000",
          "Co-Investor — $100 000: максимальный RevShare, участие в токеномике, неограниченное продвижение, ежемесячный звонок с CEO",
        ]} />
        <H>2. RevShare — условия выплат</H>
        <P>2.1. 20% от выручки Платформы по каждому из 7 источников монетизации ежемесячно направляется в Инвесторский пул RevShare. Пул распределяется пропорционально между 5 000 долей. В публичном калькуляторе на сайте для консервативности отображается доход только от источника №1 (реклама в ленте); остальные шесть источников формируют дополнительный апсайд и включаются в выплаты по мере их запуска.</P>
        <P>2.2. Распределение пула осуществляется пропорционально доле инвестора в общем фиксированном объёме 5 000 долей. Доли, не выкупленные инвесторами, остаются у платформы.</P>
        <P>2.3. Выплаты производятся в USDT (TRC-20 или ERC-20) на указанный в личном кабинете кошелёк не позднее 10-го числа месяца, следующего за отчётным.</P>
        <P>2.4. Минимальная сумма вывода: $10 USDT. При меньшем остатке средства накапливаются до следующего периода.</P>
        <H>3. Реферальная программа (MLM)</H>
        <P>3.1. Участник получает право привлекать рефералов и получать бонусы от их инвестиций по следующей структуре:</P>
        <UL items={[
          "Уровень 1 (прямые рефералы): 10% от суммы инвестиции",
          "Уровень 2: 5% от суммы инвестиции",
          "Уровень 3: 3% от суммы инвестиции",
          "Уровень 4: 1% от суммы инвестиции",
          "Уровень 5: 1% от суммы инвестиции",
        ]} />
        <P>3.2. Реферальные бонусы начисляются единовременно в момент подтверждения инвестиции реферала и выплачиваются в том же цикле, что и RevShare.</P>
        <P>3.3. Запрещено создавать фиктивные аккаунты для получения реферального бонуса. При выявлении подобных действий аккаунт блокируется, накопленные выплаты аннулируются.</P>
        <H>4. Токен $TRND</H>
        <P>4.1. Все участники инвестиционной программы получают аллокацию токена $TRND, пропорциональную размеру пакета.</P>
        <P>4.2. Бонусный коэффициент Pre-Seed стадии: ×2 к базовой аллокации.</P>
        <P>4.3. Условия vesting: 12 месяцев cliff (токены заморожены) с момента листинга, затем 24 месяца линейного разблокирования (≈4.17% в месяц).</P>
        <P>4.4. Листинг $TRND планируется при достижении 30 млн активных пользователей Платформы.</P>
        <H>5. Срок действия инвестиции</H>
        <P>5.1. Инвестиция является бессрочной в части RevShare — участник получает выплаты на всём протяжении монетизации Платформы.</P>
        <P>5.2. Досрочный возврат инвестиции не предусмотрен условиями Оферты.</P>
        <H>6. Exit-стратегия</H>
        <P>6.1. При достижении оценки Компании $200M+ планируется стратегическая продажа или IPO. Инвесторы Pre-Seed стадии получают долю от exit-суммы пропорционально размеру пакета.</P>
        <P>6.2. Целевая оценка при exit: $200M — $500M.</P>
        <H>7. Гарантии и заверения Компании</H>
        <UL items={[
          "Ежемесячная публикация финансовой отчётности в личном кабинете инвестора",
          "Аудит RevShare пула независимым аудитором (ежеквартально)",
          "Доступ к дашборду метрик платформы в режиме реального времени",
          "Уведомление о ключевых событиях через официальный Telegram-канал",
        ]} />
        <H>8. Применимое право и разрешение споров</H>
        <P>Оферта регулируется применимым законодательством. Претензии рассматриваются в течение 30 дней с момента получения. При недостижении соглашения — передача в компетентный суд.</P>
      </div>
    ),
    contentEn: (
      <div>
        <P>This Investment Offer ("Offer") is a public offer by Trends Platform ("Company") to enter into a participation agreement in the investment program under the terms below.</P>
        <P>Acceptance of this Offer is made by paying for any investment package on the Platform.</P>
        <H>1. Investment Packages</H>
        <UL items={[
          "Starter — $250: basic RevShare pool access, referral program up to 3 levels",
          "Partner — $1,000: enhanced RevShare, closed investor channel, 5-level referral program",
          "Insider — $5,000: full RevShare (all 7 monetization sources), direct team access, $10,000 ad balance",
          "Visionary — $25,000: maximum RevShare, Advisory Board, personal manager, $50,000 ad balance",
          "Co-Investor — $100,000: maximum RevShare, participation in tokenomics, unlimited promotion, monthly CEO call",
        ]} />
        <H>2. RevShare — Payment Terms</H>
        <P>2.1. 20% of Platform revenue from each of the 7 monetization sources is directed monthly to the Investor RevShare Pool. The pool is distributed proportionally among 5,000 shares. The public calculator on the website conservatively displays income only from source #1 (feed advertising); the remaining six sources represent additional upside and are included in payouts as they launch.</P>
        <P>2.2. Pool distributions are made proportionally to each investor's share of the fixed total of 5,000 shares. Shares not purchased by investors remain with the platform.</P>
        <P>2.3. Payments are made in USDT (TRC-20 or ERC-20) to the wallet specified in the personal cabinet, no later than the 10th of the month following the reporting period.</P>
        <P>2.4. Minimum withdrawal: $10 USDT. Lesser amounts accumulate to the next period.</P>
        <H>3. Referral Program (MLM)</H>
        <P>3.1. Participants may refer others and receive bonuses from their investments under the following structure:</P>
        <UL items={[
          "Level 1 (direct referrals): 10% of investment amount",
          "Level 2: 5% of investment amount",
          "Level 3: 3% of investment amount",
          "Level 4: 1% of investment amount",
          "Level 5: 1% of investment amount",
        ]} />
        <P>3.2. Referral bonuses are accrued upon confirmation of the referral's investment and paid in the same cycle as RevShare.</P>
        <P>3.3. Creating fake accounts to obtain referral bonuses is prohibited. When detected, the account is blocked and accumulated payouts are cancelled.</P>
        <H>4. $TRND Token</H>
        <P>4.1. All investment program participants receive a $TRND token allocation proportional to their package size.</P>
        <P>4.2. Pre-Seed stage bonus multiplier: ×2 to base allocation.</P>
        <P>4.3. Vesting terms: 12-month cliff (tokens frozen) from listing date, then 24-month linear unlock (≈4.17% per month).</P>
        <P>4.4. $TRND listing is planned upon reaching 30M active Platform users.</P>
        <H>5. Investment Term</H>
        <P>5.1. The investment is open-ended in terms of RevShare — participants receive payouts throughout the Platform's monetization lifecycle.</P>
        <P>5.2. Early return of investment is not provided under the Offer terms.</P>
        <H>6. Exit Strategy</H>
        <P>6.1. Upon reaching a Company valuation of $200M+, a strategic sale or IPO is planned. Pre-Seed investors receive a share of the exit amount proportional to package size.</P>
        <P>6.2. Target exit valuation: $200M — $500M.</P>
        <H>7. Company Representations</H>
        <UL items={[
          "Monthly financial reports published in the investor cabinet",
          "Quarterly independent audit of the RevShare pool",
          "Real-time access to platform metrics dashboard",
          "Key event notifications via official Telegram channel",
        ]} />
        <H>8. Governing Law and Dispute Resolution</H>
        <P>This Offer is governed by applicable law. Claims are reviewed within 30 days of receipt. Unresolved disputes are referred to a competent court.</P>
      </div>
    ),
  },
];

interface LegalModalProps {
  docId: DocId | null;
  lang: "ru" | "en";
  onClose: () => void;
}

export function LegalModal({ docId, lang, onClose }: LegalModalProps) {
  const doc = DOCS.find(d => d.id === docId);

  return (
    <AnimatePresence>
      {docId && doc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden"
            style={{ background: "rgba(10,13,28,0.98)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-7 py-5 border-b border-white/8 shrink-0">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${doc.accent}`}>
                <doc.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold flex-1">
                {lang === "ru" ? doc.titleRu : doc.titleEn}
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-7 py-6 flex-1">
              {lang === "ru" ? doc.contentRu : doc.contentEn}
            </div>

            {/* Footer */}
            <div className="px-7 py-4 border-t border-white/8 shrink-0">
              <p className="text-xs text-muted-foreground">
                {lang === "ru"
                  ? "Документ носит информационный характер. Актуальная версия всегда доступна на данной странице."
                  : "This document is for informational purposes. The current version is always available on this page."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
