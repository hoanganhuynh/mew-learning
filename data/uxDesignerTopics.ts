/**
 * 20 pre-built dialogue topics for a UI/UX Designer.
 * All conversations reflect real workplace scenarios a designer encounters daily.
 */
import { DialogueTopic } from '@/types';

export const uxDesignerTopics: DialogueTopic[] = [

  // ── 1. Design Review Meeting ─────────────────────────────────────────────────
  {
    id: 'ux-01',
    title: 'Design Review Meeting',
    description: 'Maya presents the latest iteration of a mobile banking dashboard to her product manager. Practice giving and receiving structured design feedback.',
    participants: ['Maya', 'PM'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux01-1', characterId: 'PM',   englishText: 'Good morning, Maya. Are you ready to walk us through the new dashboard design?', vietnameseText: 'Chào buổi sáng, Maya. Bạn đã sẵn sàng trình bày thiết kế dashboard mới chưa?', emotionTone: 'friendly' },
      { id: 'ux01-2', characterId: 'Maya', englishText: 'Absolutely! I have made several improvements based on last week\'s feedback. The main change is a cleaner hierarchy.', vietnameseText: 'Hoàn toàn sẵn sàng! Tôi đã thực hiện một số cải tiến dựa trên phản hồi tuần trước. Thay đổi chính là hệ thống phân cấp rõ ràng hơn.', emotionTone: 'confident' },
      { id: 'ux01-3', characterId: 'PM',   englishText: 'I like the new card layout. But I think the call-to-action button is still too small on mobile.', vietnameseText: 'Tôi thích bố cục thẻ mới. Nhưng tôi nghĩ nút kêu gọi hành động vẫn còn quá nhỏ trên mobile.', emotionTone: 'constructive' },
      { id: 'ux01-4', characterId: 'Maya', englishText: 'That is a valid point. According to Material Design guidelines, the minimum touch target should be 48 by 48 pixels.', vietnameseText: 'Đó là điểm hợp lệ. Theo hướng dẫn Material Design, vùng chạm tối thiểu phải là 48 x 48 pixel.', emotionTone: 'professional' },
      { id: 'ux01-5', characterId: 'PM',   englishText: 'Good reference. Also, can we test two different color schemes before finalizing? Our brand team prefers the blue palette.', vietnameseText: 'Tham chiếu tốt. Ngoài ra, chúng ta có thể thử nghiệm hai bảng màu khác nhau trước khi hoàn thiện không? Nhóm thương hiệu của chúng tôi thích bảng màu xanh dương.', emotionTone: 'curious' },
      { id: 'ux01-6', characterId: 'Maya', englishText: 'Sure. I will prepare an A and B variant by Thursday and share the Figma prototype link.', vietnameseText: 'Được chứ. Tôi sẽ chuẩn bị phiên bản A và B vào thứ Năm và chia sẻ đường dẫn prototype Figma.', emotionTone: 'cooperative' },
      { id: 'ux01-7', characterId: 'PM',   englishText: 'Perfect. Let us also schedule a quick stakeholder sign-off meeting for next Monday.', vietnameseText: 'Hoàn hảo. Hãy lên lịch một cuộc họp phê duyệt nhanh với các bên liên quan vào thứ Hai tới.', emotionTone: 'decisive' },
      { id: 'ux01-8', characterId: 'Maya', englishText: 'I will send the calendar invite right after this. Thanks for the thorough review!', vietnameseText: 'Tôi sẽ gửi lời mời lịch ngay sau cuộc họp này. Cảm ơn vì đã review kỹ lưỡng!', emotionTone: 'grateful' },
    ],
  },

  // ── 2. User Research Interview ───────────────────────────────────────────────
  {
    id: 'ux-02',
    title: 'User Research Interview',
    description: 'Hana, a UX researcher, conducts an interview with a participant to uncover pain points in an e-commerce checkout flow. Practice interview and empathy-mapping language.',
    participants: ['Hana', 'Participant'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux02-1', characterId: 'Hana',        englishText: 'Thank you for joining us today. There are no right or wrong answers — we just want to understand your experience.', vietnameseText: 'Cảm ơn bạn đã tham gia hôm nay. Không có câu trả lời đúng hay sai — chúng tôi chỉ muốn hiểu trải nghiệm của bạn.', emotionTone: 'warm' },
      { id: 'ux02-2', characterId: 'Participant',  englishText: 'Of course, happy to help! Where should I start?', vietnameseText: 'Tất nhiên, rất vui được giúp đỡ! Tôi nên bắt đầu từ đâu?', emotionTone: 'friendly' },
      { id: 'ux02-3', characterId: 'Hana',        englishText: 'Can you walk me through the last time you shopped online and abandoned your cart?', vietnameseText: 'Bạn có thể kể cho tôi nghe về lần cuối bạn mua sắm trực tuyến và bỏ giỏ hàng không?', emotionTone: 'curious' },
      { id: 'ux02-4', characterId: 'Participant',  englishText: 'Oh yes. I was buying shoes, but when I got to checkout it asked me to create an account. That was frustrating.', vietnameseText: 'Ồ đúng. Tôi đang mua giày, nhưng khi đến trang thanh toán nó yêu cầu tôi tạo tài khoản. Điều đó thực sự bực bội.', emotionTone: 'frustrated' },
      { id: 'ux02-5', characterId: 'Hana',        englishText: 'I see. What specifically felt frustrating — the extra step, or something else?', vietnameseText: 'Tôi hiểu. Điều gì cụ thể khiến bạn cảm thấy bực bội — bước thêm đó, hay điều gì khác?', emotionTone: 'empathetic' },
      { id: 'ux02-6', characterId: 'Participant',  englishText: 'Both! I just wanted to buy quickly. Filling out a whole form felt like too much effort for just one purchase.', vietnameseText: 'Cả hai! Tôi chỉ muốn mua nhanh. Điền vào toàn bộ biểu mẫu cảm giác quá mất công chỉ cho một lần mua.', emotionTone: 'annoyed' },
      { id: 'ux02-7', characterId: 'Hana',        englishText: 'That is really helpful. Would a guest checkout option have changed your decision?', vietnameseText: 'Điều đó thực sự hữu ích. Một tùy chọn thanh toán khách có thay đổi quyết định của bạn không?', emotionTone: 'interested' },
      { id: 'ux02-8', characterId: 'Participant',  englishText: 'Absolutely. I would have completed the purchase immediately if guest checkout was easy to find.', vietnameseText: 'Chắc chắn. Tôi đã hoàn tất giao dịch ngay lập tức nếu thanh toán khách dễ tìm thấy.', emotionTone: 'decisive' },
    ],
  },

  // ── 3. Presenting Wireframes ─────────────────────────────────────────────────
  {
    id: 'ux-03',
    title: 'Presenting Wireframes to a Client',
    description: 'Designer Leo walks a client through low-fidelity wireframes for a new SaaS onboarding flow. Practice presenting design rationale and managing client expectations.',
    participants: ['Leo', 'Client'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux03-1', characterId: 'Leo',    englishText: 'These are the initial wireframes for your onboarding flow. At this stage, we focus on structure, not visuals.', vietnameseText: 'Đây là wireframe ban đầu cho luồng onboarding của bạn. Ở giai đoạn này, chúng tôi tập trung vào cấu trúc, không phải hình thức.', emotionTone: 'professional' },
      { id: 'ux03-2', characterId: 'Client', englishText: 'I expected something that looks more finished. These look like simple boxes.', vietnameseText: 'Tôi mong đợi một thứ gì đó trông hoàn thiện hơn. Những cái này trông như những hộp đơn giản.', emotionTone: 'disappointed' },
      { id: 'ux03-3', characterId: 'Leo',    englishText: 'That is intentional. Wireframes let us validate the user flow cheaply before investing time in visual design.', vietnameseText: 'Điều đó là có chủ đích. Wireframe cho phép chúng ta xác nhận luồng người dùng một cách rẻ tiền trước khi đầu tư thời gian vào thiết kế hình thức.', emotionTone: 'calm' },
      { id: 'ux03-4', characterId: 'Client', englishText: 'I understand. So how many steps does the onboarding have?', vietnameseText: 'Tôi hiểu rồi. Vậy quá trình onboarding có bao nhiêu bước?', emotionTone: 'curious' },
      { id: 'ux03-5', characterId: 'Leo',    englishText: 'Five steps: account creation, role selection, team invitation, tour, and first action. Research shows fewer steps reduce drop-off.', vietnameseText: 'Năm bước: tạo tài khoản, chọn vai trò, mời nhóm, hướng dẫn và hành động đầu tiên. Nghiên cứu cho thấy ít bước hơn giảm tỷ lệ bỏ cuộc.', emotionTone: 'informative' },
      { id: 'ux03-6', characterId: 'Client', englishText: 'Can we also add a company logo upload step? Our clients want personalisation early on.', vietnameseText: 'Chúng ta có thể thêm bước tải lên logo công ty không? Khách hàng của chúng tôi muốn cá nhân hóa sớm.', emotionTone: 'hopeful' },
      { id: 'ux03-7', characterId: 'Leo',    englishText: 'Good idea. I can add an optional logo step between team invitation and the tour without disrupting the core flow.', vietnameseText: 'Ý tưởng hay. Tôi có thể thêm bước logo tùy chọn giữa lời mời nhóm và phần hướng dẫn mà không làm gián đoạn luồng chính.', emotionTone: 'collaborative' },
    ],
  },

  // ── 4. Design System Planning ────────────────────────────────────────────────
  {
    id: 'ux-04',
    title: 'Design System Discussion',
    description: 'Lead designer Sara and a frontend developer discuss setting up a shared component library and design tokens for a growing product team.',
    participants: ['Sara', 'Developer'],
    category: 'UI/UX',
    difficulty: 'advanced',
    lines: [
      { id: 'ux04-1', characterId: 'Sara',      englishText: 'We need a unified design system now that the team has grown to fifteen designers and twenty developers.', vietnameseText: 'Chúng ta cần một design system thống nhất ngay bây giờ vì nhóm đã phát triển lên mười lăm designer và hai mươi developer.', emotionTone: 'decisive' },
      { id: 'ux04-2', characterId: 'Developer', englishText: 'Agreed. Inconsistent spacing and colour values are slowing down development. What tool are you thinking of using?', vietnameseText: 'Đồng ý. Khoảng cách và giá trị màu không nhất quán đang làm chậm quá trình phát triển. Bạn đang nghĩ đến công cụ nào?', emotionTone: 'cooperative' },
      { id: 'ux04-3', characterId: 'Sara',      englishText: 'I want to use Figma variables for design tokens — colours, spacing, typography — and sync them with your CSS custom properties.', vietnameseText: 'Tôi muốn sử dụng biến Figma cho design token — màu sắc, khoảng cách, typography — và đồng bộ hóa với thuộc tính CSS tùy chỉnh của bạn.', emotionTone: 'enthusiastic' },
      { id: 'ux04-4', characterId: 'Developer', englishText: 'That sounds great. Can we also use Storybook to document the components on the code side?', vietnameseText: 'Nghe hay đấy. Chúng ta có thể sử dụng Storybook để ghi lại các component ở phía code không?', emotionTone: 'curious' },
      { id: 'ux04-5', characterId: 'Sara',      englishText: 'Absolutely. Figma Code Connect can link each component in Figma directly to its Storybook entry.', vietnameseText: 'Chắc chắn. Figma Code Connect có thể liên kết từng component trong Figma trực tiếp với mục Storybook tương ứng.', emotionTone: 'confident' },
      { id: 'ux04-6', characterId: 'Developer', englishText: 'Who owns the tokens when a designer wants to update a colour? I want to avoid merge conflicts.', vietnameseText: 'Ai sở hữu các token khi một designer muốn cập nhật màu sắc? Tôi muốn tránh xung đột merge.', emotionTone: 'concerned' },
      { id: 'ux04-7', characterId: 'Sara',      englishText: 'Design owns the source of truth in Figma. We will export a JSON file automatically using a GitHub Action on every publish.', vietnameseText: 'Design sở hữu nguồn sự thật trong Figma. Chúng ta sẽ xuất tệp JSON tự động bằng GitHub Action mỗi khi xuất bản.', emotionTone: 'professional' },
    ],
  },

  // ── 5. Usability Testing ─────────────────────────────────────────────────────
  {
    id: 'ux-05',
    title: 'Usability Testing Session',
    description: 'Facilitator Kai runs a moderated usability test with a participant navigating a travel booking app. Practice think-aloud protocol and neutral facilitation.',
    participants: ['Kai', 'Tester'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux05-1', characterId: 'Kai',    englishText: 'Please think out loud as you go. Tell me what you see, what you are trying to do, and what you are thinking.', vietnameseText: 'Hãy suy nghĩ to tiếng khi thực hiện. Hãy cho tôi biết bạn thấy gì, bạn đang cố làm gì và bạn đang nghĩ gì.', emotionTone: 'calm' },
      { id: 'ux05-2', characterId: 'Tester', englishText: 'Okay. I am on the homepage now. I want to search for a flight to Tokyo next Friday.', vietnameseText: 'Được rồi. Tôi đang ở trang chủ. Tôi muốn tìm chuyến bay đến Tokyo vào thứ Sáu tới.', emotionTone: 'focused' },
      { id: 'ux05-3', characterId: 'Kai',    englishText: 'Great, go ahead and try that.', vietnameseText: 'Tốt, hãy thử làm điều đó.', emotionTone: 'neutral' },
      { id: 'ux05-4', characterId: 'Tester', englishText: 'Hmm, I see a search bar but I am not sure if it is for flights or hotels. The label is not very clear.', vietnameseText: 'Hmm, tôi thấy thanh tìm kiếm nhưng không chắc đó là cho chuyến bay hay khách sạn. Nhãn không rõ ràng lắm.', emotionTone: 'confused' },
      { id: 'ux05-5', characterId: 'Kai',    englishText: 'What would you expect to see there to make it clearer?', vietnameseText: 'Bạn mong đợi thấy gì ở đó để nó rõ ràng hơn?', emotionTone: 'curious' },
      { id: 'ux05-6', characterId: 'Tester', englishText: 'Maybe tabs — like one tab for flights, one for hotels, one for cars. The way most booking sites work.', vietnameseText: 'Có lẽ là các tab — như một tab cho chuyến bay, một cho khách sạn, một cho xe. Giống như cách hầu hết các trang đặt phòng hoạt động.', emotionTone: 'helpful' },
      { id: 'ux05-7', characterId: 'Kai',    englishText: 'Interesting. Please continue and show me what happens when you select a date.', vietnameseText: 'Thú vị. Hãy tiếp tục và cho tôi thấy điều gì xảy ra khi bạn chọn ngày.', emotionTone: 'attentive' },
      { id: 'ux05-8', characterId: 'Tester', englishText: 'I clicked the date field but the calendar opened below the screen. I had to scroll down to see it — that is annoying.', vietnameseText: 'Tôi nhấp vào trường ngày nhưng lịch mở ra bên dưới màn hình. Tôi phải cuộn xuống để xem — điều đó thật phiền.', emotionTone: 'frustrated' },
    ],
  },

  // ── 6. Stakeholder Design Pitch ──────────────────────────────────────────────
  {
    id: 'ux-06',
    title: 'Pitching a Redesign to Leadership',
    description: 'Designer Nina presents the business case for a full product redesign to the company CEO. Practice persuasive language and data-driven design arguments.',
    participants: ['Nina', 'CEO'],
    category: 'UI/UX',
    difficulty: 'advanced',
    lines: [
      { id: 'ux06-1', characterId: 'Nina', englishText: 'Our current onboarding completion rate is 42 percent. After the redesign, I project it will reach 68 percent based on our research.', vietnameseText: 'Tỷ lệ hoàn thành onboarding hiện tại của chúng ta là 42 phần trăm. Sau khi thiết kế lại, tôi dự báo sẽ đạt 68 phần trăm dựa trên nghiên cứu của chúng ta.', emotionTone: 'confident' },
      { id: 'ux06-2', characterId: 'CEO',  englishText: 'That is a significant improvement. What is driving that number?', vietnameseText: 'Đó là một cải tiến đáng kể. Điều gì thúc đẩy con số đó?', emotionTone: 'interested' },
      { id: 'ux06-3', characterId: 'Nina', englishText: 'We conducted twelve user interviews and five usability tests. The main friction point is the five-step form on the first screen.', vietnameseText: 'Chúng ta đã tiến hành mười hai cuộc phỏng vấn người dùng và năm bài kiểm tra khả năng sử dụng. Điểm ma sát chính là biểu mẫu năm bước trên màn hình đầu tiên.', emotionTone: 'informative' },
      { id: 'ux06-4', characterId: 'CEO',  englishText: 'How long will the redesign take and what is the budget estimate?', vietnameseText: 'Thiết kế lại sẽ mất bao lâu và ước tính ngân sách là bao nhiêu?', emotionTone: 'analytical' },
      { id: 'ux06-5', characterId: 'Nina', englishText: 'We estimate three months for design and testing, with a development cost of roughly fifty thousand dollars.', vietnameseText: 'Chúng ta ước tính ba tháng cho thiết kế và kiểm tra, với chi phí phát triển khoảng năm mươi nghìn đô la.', emotionTone: 'precise' },
      { id: 'ux06-6', characterId: 'CEO',  englishText: 'And what is the revenue impact if we hit that 68 percent target?', vietnameseText: 'Và tác động doanh thu là gì nếu chúng ta đạt mục tiêu 68 phần trăm đó?', emotionTone: 'analytical' },
      { id: 'ux06-7', characterId: 'Nina', englishText: 'Based on our average revenue per user, that translates to approximately 1.2 million additional dollars annually.', vietnameseText: 'Dựa trên doanh thu trung bình trên mỗi người dùng, điều đó tương đương khoảng 1,2 triệu đô la bổ sung hàng năm.', emotionTone: 'persuasive' },
    ],
  },

  // ── 7. Design Critique Session ───────────────────────────────────────────────
  {
    id: 'ux-07',
    title: 'Design Critique Between Peers',
    description: 'Two designers, Chris and Ella, give each other structured feedback on their navigation redesigns. Practice using the SBI feedback model: Situation, Behavior, Impact.',
    participants: ['Chris', 'Ella'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux07-1', characterId: 'Chris', englishText: 'Ella, I love your use of whitespace. The layout breathes really well. Can I share one concern though?', vietnameseText: 'Ella, tôi rất thích cách bạn sử dụng khoảng trắng. Bố cục trông thật thoáng. Tôi có thể chia sẻ một lo ngại không?', emotionTone: 'appreciative' },
      { id: 'ux07-2', characterId: 'Ella',  englishText: 'Please do! I specifically want your honest opinion on the navigation structure.', vietnameseText: 'Xin mời! Tôi đặc biệt muốn ý kiến thẳng thắn của bạn về cấu trúc điều hướng.', emotionTone: 'open' },
      { id: 'ux07-3', characterId: 'Chris', englishText: 'The secondary navigation items are quite small on the desktop view. In user testing, small targets cause misclicks and slow users down.', vietnameseText: 'Các mục điều hướng phụ khá nhỏ trong chế độ xem máy tính. Trong kiểm tra người dùng, mục tiêu nhỏ gây ra nhấp nhầm và làm chậm người dùng.', emotionTone: 'constructive' },
      { id: 'ux07-4', characterId: 'Ella',  englishText: 'That is fair. I was trying to keep the navigation unobtrusive, but maybe I went too far.', vietnameseText: 'Điều đó hợp lý. Tôi đang cố giữ điều hướng không gây chú ý, nhưng có lẽ tôi đã đi quá xa.', emotionTone: 'reflective' },
      { id: 'ux07-5', characterId: 'Chris', englishText: 'What if you increased the click area without enlarging the visible text? You can add padding around each item.', vietnameseText: 'Nếu bạn tăng vùng nhấp mà không phóng to văn bản hiển thị thì sao? Bạn có thể thêm padding xung quanh mỗi mục.', emotionTone: 'helpful' },
      { id: 'ux07-6', characterId: 'Ella',  englishText: 'Oh, that is a clever solution. It maintains the minimal aesthetic while improving usability.', vietnameseText: 'Ồ, đó là giải pháp thông minh. Nó giữ được tính thẩm mỹ tối giản trong khi cải thiện khả năng sử dụng.', emotionTone: 'excited' },
      { id: 'ux07-7', characterId: 'Chris', englishText: 'Exactly. Now tell me — what do you think about my colour choices for the active state indicator?', vietnameseText: 'Chính xác. Bây giờ hãy nói cho tôi biết — bạn nghĩ gì về lựa chọn màu sắc của tôi cho chỉ báo trạng thái hoạt động?', emotionTone: 'curious' },
      { id: 'ux07-8', characterId: 'Ella',  englishText: 'Honestly? The green is a bit too vivid. It competes with the primary call-to-action button and splits the user\'s attention.', vietnameseText: 'Thành thật mà nói? Màu xanh lá hơi quá sặc sỡ. Nó cạnh tranh với nút kêu gọi hành động chính và chia tách sự chú ý của người dùng.', emotionTone: 'honest' },
    ],
  },

  // ── 8. Accessibility Review ──────────────────────────────────────────────────
  {
    id: 'ux-08',
    title: 'Accessibility Audit Discussion',
    description: 'Designer Priya and an accessibility specialist review a product against WCAG 2.1 AA standards. Practice accessibility terminology and inclusive design language.',
    participants: ['Priya', 'Specialist'],
    category: 'UI/UX',
    difficulty: 'advanced',
    lines: [
      { id: 'ux08-1', characterId: 'Specialist', englishText: 'I ran an accessibility audit on your product. The good news is structure and keyboard navigation are solid.', vietnameseText: 'Tôi đã chạy kiểm tra khả năng tiếp cận trên sản phẩm của bạn. Tin tốt là cấu trúc và điều hướng bàn phím khá tốt.', emotionTone: 'balanced' },
      { id: 'ux08-2', characterId: 'Priya',      englishText: 'Great to hear. What are the main issues I need to address?', vietnameseText: 'Thật tuyệt. Các vấn đề chính tôi cần giải quyết là gì?', emotionTone: 'attentive' },
      { id: 'ux08-3', characterId: 'Specialist', englishText: 'The colour contrast ratio on the secondary button text is 3.2 to 1. WCAG AA requires at least 4.5 to 1 for normal text.', vietnameseText: 'Tỷ lệ độ tương phản màu sắc trên văn bản nút phụ là 3,2 trên 1. WCAG AA yêu cầu ít nhất 4,5 trên 1 cho văn bản thông thường.', emotionTone: 'precise' },
      { id: 'ux08-4', characterId: 'Priya',      englishText: 'I can darken the text colour. Will that affect the overall brand palette?', vietnameseText: 'Tôi có thể làm tối màu văn bản. Điều đó có ảnh hưởng đến bảng màu thương hiệu tổng thể không?', emotionTone: 'concerned' },
      { id: 'ux08-5', characterId: 'Specialist', englishText: 'Slightly, but brand accessibility is a legal requirement in many markets. A small hue shift usually resolves it.', vietnameseText: 'Hơi ảnh hưởng, nhưng khả năng tiếp cận thương hiệu là yêu cầu pháp lý ở nhiều thị trường. Một sự thay đổi sắc độ nhỏ thường giải quyết được.', emotionTone: 'informative' },
      { id: 'ux08-6', characterId: 'Priya',      englishText: 'What about screen reader support? Our product serves users with visual impairments.', vietnameseText: 'Còn hỗ trợ trình đọc màn hình thì sao? Sản phẩm của chúng tôi phục vụ người dùng khiếm thị.', emotionTone: 'concerned' },
      { id: 'ux08-7', characterId: 'Specialist', englishText: 'All interactive elements need proper ARIA labels. For example, your icon-only buttons currently have no accessible name.', vietnameseText: 'Tất cả các phần tử tương tác cần nhãn ARIA phù hợp. Ví dụ, các nút chỉ có biểu tượng của bạn hiện không có tên có thể truy cập.', emotionTone: 'professional' },
    ],
  },

  // ── 9. Mentoring a Junior Designer ──────────────────────────────────────────
  {
    id: 'ux-09',
    title: 'Mentoring a Junior Designer',
    description: 'Senior designer Ryan helps junior designer Mia understand how to apply visual hierarchy principles to her work.',
    participants: ['Ryan', 'Mia'],
    category: 'UI/UX',
    difficulty: 'beginner',
    lines: [
      { id: 'ux09-1', characterId: 'Mia',  englishText: 'Ryan, my layout looks cluttered but I cannot figure out why. Can you take a look?', vietnameseText: 'Ryan, bố cục của tôi trông lộn xộn nhưng tôi không thể tìm ra lý do. Bạn có thể xem qua không?', emotionTone: 'uncertain' },
      { id: 'ux09-2', characterId: 'Ryan', englishText: 'Sure! Looking at it now — I think the issue is that every element is fighting for the same level of attention.', vietnameseText: 'Chắc chắn! Nhìn vào bây giờ — tôi nghĩ vấn đề là mỗi phần tử đang tranh giành cùng mức độ chú ý.', emotionTone: 'helpful' },
      { id: 'ux09-3', characterId: 'Mia',  englishText: 'What do you mean by that?', vietnameseText: 'Bạn có nghĩa là gì với điều đó?', emotionTone: 'curious' },
      { id: 'ux09-4', characterId: 'Ryan', englishText: 'Visual hierarchy means guiding the eye. Ask yourself: what is the one thing a user must notice first on this screen?', vietnameseText: 'Hệ thống phân cấp hình ảnh có nghĩa là hướng dẫn mắt nhìn. Hãy tự hỏi: điều gì là một thứ người dùng phải chú ý đầu tiên trên màn hình này?', emotionTone: 'mentoring' },
      { id: 'ux09-5', characterId: 'Mia',  englishText: 'The headline — the product name, I suppose.', vietnameseText: 'Tiêu đề — tên sản phẩm, tôi cho là vậy.', emotionTone: 'tentative' },
      { id: 'ux09-6', characterId: 'Ryan', englishText: 'Exactly. So make that headline significantly larger and bolder than everything else. Then scale everything else down from there.', vietnameseText: 'Chính xác. Vậy hãy làm cho tiêu đề đó lớn hơn và đậm hơn đáng kể so với mọi thứ khác. Sau đó thu nhỏ mọi thứ khác từ đó.', emotionTone: 'encouraging' },
      { id: 'ux09-7', characterId: 'Mia',  englishText: 'I see it now! And I should also add more whitespace between sections to create visual breathing room.', vietnameseText: 'Bây giờ tôi hiểu rồi! Và tôi cũng nên thêm nhiều khoảng trắng hơn giữa các phần để tạo không gian thở hình ảnh.', emotionTone: 'excited' },
    ],
  },

  // ── 10. Client Change Requests ───────────────────────────────────────────────
  {
    id: 'ux-10',
    title: 'Handling Client Revision Requests',
    description: 'Designer Zoe manages a difficult conversation when a client requests late-stage changes that conflict with UX best practices.',
    participants: ['Zoe', 'Client'],
    category: 'UI/UX',
    difficulty: 'advanced',
    lines: [
      { id: 'ux10-1', characterId: 'Client', englishText: 'Zoe, I want to add five more items to the main navigation bar. Our team just listed all the features we want accessible.', vietnameseText: 'Zoe, tôi muốn thêm năm mục nữa vào thanh điều hướng chính. Nhóm của chúng tôi vừa liệt kê tất cả các tính năng muốn dễ tiếp cận.', emotionTone: 'decisive' },
      { id: 'ux10-2', characterId: 'Zoe',    englishText: 'I completely understand why you want that visibility. However, research shows that navigation with more than seven items significantly reduces findability.', vietnameseText: 'Tôi hoàn toàn hiểu tại sao bạn muốn khả năng hiển thị đó. Tuy nhiên, nghiên cứu cho thấy điều hướng với hơn bảy mục làm giảm đáng kể khả năng tìm kiếm.', emotionTone: 'diplomatic' },
      { id: 'ux10-3', characterId: 'Client', englishText: 'But our users need to access everything quickly. We cannot hide features in dropdowns.', vietnameseText: 'Nhưng người dùng của chúng tôi cần truy cập mọi thứ nhanh chóng. Chúng tôi không thể ẩn các tính năng trong menu thả xuống.', emotionTone: 'firm' },
      { id: 'ux10-4', characterId: 'Zoe',    englishText: 'I hear you. What if we ran a quick card sorting exercise with ten of your users to let data guide the decision?', vietnameseText: 'Tôi hiểu ý bạn. Nếu chúng ta thực hiện một bài tập phân loại thẻ nhanh với mười người dùng của bạn để dữ liệu hướng dẫn quyết định thì sao?', emotionTone: 'collaborative' },
      { id: 'ux10-5', characterId: 'Client', englishText: 'That could work. How long would that take?', vietnameseText: 'Điều đó có thể hoạt động. Mất bao lâu?', emotionTone: 'interested' },
      { id: 'ux10-6', characterId: 'Zoe',    englishText: 'About three days. I will send you the report and then we can decide together based on what users actually prioritise.', vietnameseText: 'Khoảng ba ngày. Tôi sẽ gửi cho bạn báo cáo và sau đó chúng ta có thể quyết định cùng nhau dựa trên những gì người dùng thực sự ưu tiên.', emotionTone: 'reassuring' },
      { id: 'ux10-7', characterId: 'Client', englishText: 'Alright, let us do that first. I appreciate you backing this up with data rather than just saying no.', vietnameseText: 'Được rồi, hãy làm điều đó trước. Tôi đánh giá cao việc bạn hỗ trợ điều này bằng dữ liệu thay vì chỉ nói không.', emotionTone: 'satisfied' },
    ],
  },

  // ── 11. Sprint Planning ──────────────────────────────────────────────────────
  {
    id: 'ux-11',
    title: 'Agile Sprint Planning for Design',
    description: 'UX designer Tom and a scrum master discuss estimating and prioritising design tasks for the upcoming sprint.',
    participants: ['Tom', 'ScrumMaster'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux11-1', characterId: 'ScrumMaster', englishText: 'Tom, we have twelve design stories in the backlog for this sprint. Can we go through the estimates?', vietnameseText: 'Tom, chúng ta có mười hai design story trong backlog cho sprint này. Chúng ta có thể xem qua các ước tính không?', emotionTone: 'organised' },
      { id: 'ux11-2', characterId: 'Tom',         englishText: 'Absolutely. The checkout redesign is our biggest ticket — I estimate 8 story points because it involves three different user flows.', vietnameseText: 'Chắc chắn. Thiết kế lại trang thanh toán là vé lớn nhất của chúng ta — tôi ước tính 8 điểm câu chuyện vì nó liên quan đến ba luồng người dùng khác nhau.', emotionTone: 'analytical' },
      { id: 'ux11-3', characterId: 'ScrumMaster', englishText: 'That seems high. Can we break it into smaller stories?', vietnameseText: 'Có vẻ nhiều. Chúng ta có thể chia nhỏ thành các story nhỏ hơn không?', emotionTone: 'curious' },
      { id: 'ux11-4', characterId: 'Tom',         englishText: 'Good idea. We could split it into guest checkout, registered user checkout, and payment method screens — 3 points each.', vietnameseText: 'Ý tưởng hay. Chúng ta có thể tách thành thanh toán khách, thanh toán người dùng đã đăng ký và màn hình phương thức thanh toán — mỗi cái 3 điểm.', emotionTone: 'problem-solving' },
      { id: 'ux11-5', characterId: 'ScrumMaster', englishText: 'Much better. What about the onboarding email templates? Those were requested by marketing.', vietnameseText: 'Tốt hơn nhiều. Còn về các mẫu email onboarding thì sao? Những cái đó được yêu cầu bởi marketing.', emotionTone: 'neutral' },
      { id: 'ux11-6', characterId: 'Tom',         englishText: 'Those are 2 points. They follow the existing design system, so it should be straightforward once the copy is ready.', vietnameseText: 'Những cái đó là 2 điểm. Chúng tuân theo design system hiện có, vì vậy sẽ đơn giản khi có sẵn nội dung.', emotionTone: 'matter-of-fact' },
      { id: 'ux11-7', characterId: 'ScrumMaster', englishText: 'Perfect. I will add a dependency on the copywriter. Is there anything blocking you before the sprint starts?', vietnameseText: 'Hoàn hảo. Tôi sẽ thêm sự phụ thuộc vào người viết nội dung. Có điều gì chặn bạn trước khi sprint bắt đầu không?', emotionTone: 'organised' },
    ],
  },

  // ── 12. Developer Handoff ────────────────────────────────────────────────────
  {
    id: 'ux-12',
    title: 'Design Handoff to Developers',
    description: 'Designer Amy walks a frontend developer through the completed Figma file, explaining specifications, components, and edge cases before development begins.',
    participants: ['Amy', 'Dev'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux12-1', characterId: 'Amy', englishText: 'I have prepared the handoff file. Every screen has specs in the sidebar and components are all linked to the design system.', vietnameseText: 'Tôi đã chuẩn bị tệp bàn giao. Mỗi màn hình có thông số kỹ thuật trong thanh bên và tất cả các component đều được liên kết với design system.', emotionTone: 'organised' },
      { id: 'ux12-2', characterId: 'Dev', englishText: 'Looks good. Can you walk me through the responsive behaviour? I need to know the breakpoints.', vietnameseText: 'Trông tốt. Bạn có thể hướng dẫn tôi về hành vi responsive không? Tôi cần biết các breakpoint.', emotionTone: 'focused' },
      { id: 'ux12-3', characterId: 'Amy', englishText: 'Sure. We have three breakpoints: 375 pixels for mobile, 768 for tablet, and 1280 and above for desktop.', vietnameseText: 'Chắc chắn. Chúng ta có ba breakpoint: 375 pixel cho mobile, 768 cho tablet, và 1280 trở lên cho desktop.', emotionTone: 'precise' },
      { id: 'ux12-4', characterId: 'Dev', englishText: 'What about the card grid? Does it collapse to a single column on mobile?', vietnameseText: 'Còn về lưới thẻ thì sao? Nó có thu gọn thành một cột trên mobile không?', emotionTone: 'curious' },
      { id: 'ux12-5', characterId: 'Amy', englishText: 'Yes. Desktop is four columns, tablet is two columns, and mobile is one column with 16 pixel gutters throughout.', vietnameseText: 'Đúng. Desktop là bốn cột, tablet là hai cột, và mobile là một cột với 16 pixel gutter xuyên suốt.', emotionTone: 'informative' },
      { id: 'ux12-6', characterId: 'Dev', englishText: 'What should happen to the sticky navigation on scroll? Does it collapse or stay the same height?', vietnameseText: 'Điều gì sẽ xảy ra với điều hướng dính khi cuộn? Nó có thu gọn hay giữ nguyên chiều cao không?', emotionTone: 'curious' },
      { id: 'ux12-7', characterId: 'Amy', englishText: 'It shrinks from 72 to 48 pixels and the logo scales down too. I have a prototype showing the animation — let me share the link.', vietnameseText: 'Nó thu nhỏ từ 72 xuống 48 pixel và logo cũng thu nhỏ theo. Tôi có một prototype hiển thị hoạt ảnh — để tôi chia sẻ đường dẫn.', emotionTone: 'helpful' },
      { id: 'ux12-8', characterId: 'Dev', englishText: 'Perfect. And what is the easing function for the animation? I want it to match the design exactly.', vietnameseText: 'Hoàn hảo. Và hàm easing cho hoạt ảnh là gì? Tôi muốn nó khớp chính xác với thiết kế.', emotionTone: 'detail-oriented' },
    ],
  },

  // ── 13. A/B Test Analysis ────────────────────────────────────────────────────
  {
    id: 'ux-13',
    title: 'Reviewing A/B Test Results',
    description: 'Designer Lily and a data analyst discuss the results of a two-week A/B test on a call-to-action button. Practice interpreting data and making design decisions.',
    participants: ['Lily', 'Analyst'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux13-1', characterId: 'Analyst', englishText: 'The A/B test ran for fourteen days with 50,000 visitors per variant. The results are statistically significant.', vietnameseText: 'Bài kiểm tra A/B chạy trong mười bốn ngày với 50.000 khách truy cập mỗi biến thể. Kết quả có ý nghĩa thống kê.', emotionTone: 'professional' },
      { id: 'ux13-2', characterId: 'Lily',    englishText: 'Excellent. What was the click-through rate difference between the green button and the orange one?', vietnameseText: 'Tuyệt vời. Sự khác biệt về tỷ lệ nhấp chuột giữa nút xanh lá và nút cam là bao nhiêu?', emotionTone: 'curious' },
      { id: 'ux13-3', characterId: 'Analyst', englishText: 'Variant B — the orange button — had a 23 percent higher click-through rate. Conversion also improved by 17 percent.', vietnameseText: 'Biến thể B — nút cam — có tỷ lệ nhấp chuột cao hơn 23 phần trăm. Tỷ lệ chuyển đổi cũng cải thiện 17 phần trăm.', emotionTone: 'informative' },
      { id: 'ux13-4', characterId: 'Lily',    englishText: 'Interesting. The orange creates more contrast against our blue background. That likely explains the lift.', vietnameseText: 'Thú vị. Màu cam tạo độ tương phản cao hơn so với nền xanh lam của chúng ta. Điều đó có thể giải thích sự cải thiện.', emotionTone: 'analytical' },
      { id: 'ux13-5', characterId: 'Analyst', englishText: 'One caveat — the orange clashes slightly with the brand guidelines. Is that a concern?', vietnameseText: 'Một lưu ý — màu cam hơi xung đột với hướng dẫn thương hiệu. Điều đó có phải là mối lo ngại không?', emotionTone: 'cautious' },
      { id: 'ux13-6', characterId: 'Lily',    englishText: 'Good point. I will work with the brand team to find an on-brand orange variant that maintains the contrast ratio.', vietnameseText: 'Điểm tốt. Tôi sẽ làm việc với nhóm thương hiệu để tìm một biến thể cam đúng thương hiệu duy trì tỷ lệ tương phản.', emotionTone: 'solution-oriented' },
      { id: 'ux13-7', characterId: 'Analyst', englishText: 'Sounds like a plan. I would recommend rolling out the winning variant to 100 percent of users by end of week.', vietnameseText: 'Nghe có vẻ là một kế hoạch. Tôi khuyên nên triển khai biến thể chiến thắng cho 100 phần trăm người dùng vào cuối tuần.', emotionTone: 'decisive' },
    ],
  },

  // ── 14. Mobile-First Design Debate ──────────────────────────────────────────
  {
    id: 'ux-14',
    title: 'Mobile-First vs Desktop-First Discussion',
    description: 'UX designer Nora and a product manager debate the best responsive design approach for a new enterprise dashboard.',
    participants: ['Nora', 'PM'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux14-1', characterId: 'PM',   englishText: 'Our analytics show that 80 percent of users access the dashboard from desktop. Should we not design desktop-first?', vietnameseText: 'Phân tích của chúng ta cho thấy 80 phần trăm người dùng truy cập dashboard từ máy tính. Chúng ta không nên thiết kế desktop trước sao?', emotionTone: 'logical' },
      { id: 'ux14-2', characterId: 'Nora', englishText: 'That is the current behaviour. But our roadmap includes mobile features for field workers — that audience will prefer phones.', vietnameseText: 'Đó là hành vi hiện tại. Nhưng lộ trình của chúng ta bao gồm các tính năng mobile cho nhân viên thực địa — đối tượng đó sẽ thích điện thoại hơn.', emotionTone: 'forward-thinking' },
      { id: 'ux14-3', characterId: 'PM',   englishText: 'I see your point. But mobile-first often means sacrificing complex data tables that power users need.', vietnameseText: 'Tôi thấy quan điểm của bạn. Nhưng mobile-first thường có nghĩa là hy sinh các bảng dữ liệu phức tạp mà người dùng chuyên nghiệp cần.', emotionTone: 'concerned' },
      { id: 'ux14-4', characterId: 'Nora', englishText: 'Mobile-first does not mean mobile-only. It means we start with constraints and progressively enhance for larger screens.', vietnameseText: 'Mobile-first không có nghĩa là mobile-only. Nó có nghĩa là chúng ta bắt đầu với các ràng buộc và cải tiến dần dần cho màn hình lớn hơn.', emotionTone: 'educational' },
      { id: 'ux14-5', characterId: 'PM',   englishText: 'Can you show me an example of how the data table would work on mobile?', vietnameseText: 'Bạn có thể cho tôi xem một ví dụ về cách bảng dữ liệu sẽ hoạt động trên mobile không?', emotionTone: 'curious' },
      { id: 'ux14-6', characterId: 'Nora', englishText: 'Sure. On mobile, we show a summary card per row with the key metric. Tapping expands to see all columns. Desktop shows the full table by default.', vietnameseText: 'Chắc chắn. Trên mobile, chúng ta hiển thị thẻ tóm tắt mỗi hàng với chỉ số chính. Nhấn vào để mở rộng xem tất cả các cột. Desktop hiển thị bảng đầy đủ theo mặc định.', emotionTone: 'illustrative' },
      { id: 'ux14-7', characterId: 'PM',   englishText: 'That is actually quite elegant. Let us go with mobile-first then and review after each sprint.', vietnameseText: 'Điều đó thực sự khá tinh tế. Vậy hãy đi theo mobile-first và review sau mỗi sprint.', emotionTone: 'convinced' },
    ],
  },

  // ── 15. User Persona Workshop ────────────────────────────────────────────────
  {
    id: 'ux-15',
    title: 'Building User Personas',
    description: 'UX designer Jess facilitates a workshop with a marketing manager to synthesise research data into actionable user personas for a fitness app.',
    participants: ['Jess', 'Marketing'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux15-1', characterId: 'Jess',      englishText: 'Based on our interviews and survey data, I identified three distinct user segments. Let me walk you through each one.', vietnameseText: 'Dựa trên các cuộc phỏng vấn và dữ liệu khảo sát, tôi đã xác định được ba phân khúc người dùng riêng biệt. Hãy để tôi hướng dẫn bạn qua từng cái.', emotionTone: 'professional' },
      { id: 'ux15-2', characterId: 'Marketing', englishText: 'Great. Are these based on demographics or behaviour? We usually segment by age group.', vietnameseText: 'Tuyệt. Những cái này dựa trên nhân khẩu học hay hành vi? Chúng tôi thường phân khúc theo nhóm tuổi.', emotionTone: 'curious' },
      { id: 'ux15-3', characterId: 'Jess',      englishText: 'Behaviour-based. Age alone does not predict product behaviour well. Our segment one is the "Goal Tracker" — motivated by measurable progress.', vietnameseText: 'Dựa trên hành vi. Độ tuổi một mình không dự đoán hành vi sản phẩm tốt. Phân khúc một của chúng ta là "Goal Tracker" — được thúc đẩy bởi tiến độ có thể đo lường.', emotionTone: 'explanatory' },
      { id: 'ux15-4', characterId: 'Marketing', englishText: 'I love that name. It is much more actionable than just saying 25 to 34 year olds.', vietnameseText: 'Tôi thích cái tên đó. Nó có tính hành động cao hơn nhiều so với việc chỉ nói từ 25 đến 34 tuổi.', emotionTone: 'enthusiastic' },
      { id: 'ux15-5', characterId: 'Jess',      englishText: 'Exactly. Our second persona is the "Social Exerciser" — she is motivated by community, challenges, and sharing her activity online.', vietnameseText: 'Chính xác. Persona thứ hai của chúng ta là "Social Exerciser" — cô ấy được thúc đẩy bởi cộng đồng, thách thức và chia sẻ hoạt động trực tuyến.', emotionTone: 'engaged' },
      { id: 'ux15-6', characterId: 'Marketing', englishText: 'That sounds like our most engaged segment. Can we design specific features just for her?', vietnameseText: 'Nghe có vẻ là phân khúc tương tác nhất của chúng ta. Chúng ta có thể thiết kế các tính năng cụ thể chỉ dành cho cô ấy không?', emotionTone: 'excited' },
      { id: 'ux15-7', characterId: 'Jess',      englishText: 'That is exactly the point of personas — to make design decisions. For her, we should prioritise the social feed, badges, and group challenges.', vietnameseText: 'Đó chính xác là điểm của personas — để đưa ra quyết định thiết kế. Đối với cô ấy, chúng ta nên ưu tiên nguồn cấp dữ liệu xã hội, huy hiệu và thách thức nhóm.', emotionTone: 'strategic' },
    ],
  },

  // ── 16. Competitive Analysis ─────────────────────────────────────────────────
  {
    id: 'ux-16',
    title: 'Presenting a Competitive UX Analysis',
    description: 'Designer Finn presents findings from a competitive UX audit of three rival productivity apps to a product stakeholder.',
    participants: ['Finn', 'Stakeholder'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux16-1', characterId: 'Finn',        englishText: 'I analysed three competitors: Notion, Asana, and Monday. I evaluated each on onboarding, navigation, and collaboration features.', vietnameseText: 'Tôi đã phân tích ba đối thủ cạnh tranh: Notion, Asana và Monday. Tôi đánh giá từng sản phẩm về onboarding, điều hướng và tính năng cộng tác.', emotionTone: 'professional' },
      { id: 'ux16-2', characterId: 'Stakeholder', englishText: 'What stood out as the biggest opportunity gap for us?', vietnameseText: 'Điều gì nổi bật như là khoảng cách cơ hội lớn nhất cho chúng ta?', emotionTone: 'interested' },
      { id: 'ux16-3', characterId: 'Finn',        englishText: 'All three have complex onboarding. None offers a meaningful template to help new users create their first project in under two minutes.', vietnameseText: 'Cả ba đều có quá trình onboarding phức tạp. Không ai cung cấp mẫu có ý nghĩa để giúp người dùng mới tạo dự án đầu tiên trong vòng hai phút.', emotionTone: 'analytical' },
      { id: 'ux16-4', characterId: 'Stakeholder', englishText: 'That is a compelling insight. What does the best-in-class look like for navigation?', vietnameseText: 'Đó là một nhận xét thuyết phục. Chuẩn mực tốt nhất về điều hướng trông như thế nào?', emotionTone: 'curious' },
      { id: 'ux16-5', characterId: 'Finn',        englishText: 'Notion uses a collapsible sidebar with drag-and-drop reordering. Users love the flexibility, but it can become overwhelming with large workspaces.', vietnameseText: 'Notion sử dụng thanh bên thu gọn được với sắp xếp kéo và thả. Người dùng thích sự linh hoạt này, nhưng nó có thể trở nên áp đảo với không gian làm việc lớn.', emotionTone: 'informative' },
      { id: 'ux16-6', characterId: 'Stakeholder', englishText: 'So our differentiator could be a smarter, guided navigation that adapts to how each user works?', vietnameseText: 'Vậy điểm khác biệt của chúng ta có thể là một điều hướng thông minh hơn, có hướng dẫn thích ứng với cách mỗi người dùng làm việc?', emotionTone: 'strategic' },
      { id: 'ux16-7', characterId: 'Finn',        englishText: 'Exactly. A personalised navigation that surfaces the most-used items automatically would be a genuine market differentiator.', vietnameseText: 'Chính xác. Một điều hướng được cá nhân hóa tự động hiển thị các mục được sử dụng nhiều nhất sẽ là điểm khác biệt thị trường thực sự.', emotionTone: 'enthusiastic' },
    ],
  },

  // ── 17. Brand & Color Palette ────────────────────────────────────────────────
  {
    id: 'ux-17',
    title: 'Choosing Brand Colours and Typography',
    description: 'UI designer Chloe and a brand manager collaborate on establishing the visual identity for a new fintech startup, including colour and typeface decisions.',
    participants: ['Chloe', 'Brand'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux17-1', characterId: 'Chloe', englishText: 'I have prepared three colour palette directions. Direction A is trustworthy navy and gold — classic finance. Direction B is modern teal and white.', vietnameseText: 'Tôi đã chuẩn bị ba hướng bảng màu. Hướng A là xanh hải quân và vàng đáng tin cậy — tài chính cổ điển. Hướng B là teal hiện đại và trắng.', emotionTone: 'professional' },
      { id: 'ux17-2', characterId: 'Brand', englishText: 'I like Direction B. It feels more approachable for younger users. What is Direction C?', vietnameseText: 'Tôi thích Hướng B. Nó cảm thấy dễ tiếp cận hơn cho người dùng trẻ. Hướng C là gì?', emotionTone: 'interested' },
      { id: 'ux17-3', characterId: 'Chloe', englishText: 'Direction C uses a purple gradient — it signals innovation and is quite distinct in the fintech market.', vietnameseText: 'Hướng C sử dụng gradient tím — nó báo hiệu sự đổi mới và khá nổi bật trong thị trường fintech.', emotionTone: 'excited' },
      { id: 'ux17-4', characterId: 'Brand', englishText: 'I worry purple might feel too playful for a finance app. We want users to trust us with their money.', vietnameseText: 'Tôi lo lắng màu tím có thể cảm thấy quá vui nhộn cho một ứng dụng tài chính. Chúng ta muốn người dùng tin tưởng chúng ta với tiền của họ.', emotionTone: 'cautious' },
      { id: 'ux17-5', characterId: 'Chloe', englishText: 'That is valid. Colour psychology matters in finance. Shall we use Direction B as the base and add a trustworthy deep blue as a secondary?', vietnameseText: 'Điều đó hợp lệ. Tâm lý màu sắc quan trọng trong tài chính. Chúng ta có sử dụng Hướng B làm cơ sở và thêm màu xanh đậm đáng tin cậy làm màu phụ không?', emotionTone: 'collaborative' },
      { id: 'ux17-6', characterId: 'Brand', englishText: 'Yes! And for typography, I want something modern yet readable. Avoid anything that looks too decorative.', vietnameseText: 'Vâng! Và đối với typography, tôi muốn thứ gì đó hiện đại nhưng dễ đọc. Tránh bất cứ thứ gì trông quá trang trí.', emotionTone: 'decisive' },
      { id: 'ux17-7', characterId: 'Chloe', englishText: 'I suggest Inter for the UI and headings, with Georgia for long-form reading. Inter is neutral and highly legible at small sizes on screen.', vietnameseText: 'Tôi đề xuất Inter cho UI và tiêu đề, với Georgia cho đọc dài. Inter trung tính và rất dễ đọc ở kích thước nhỏ trên màn hình.', emotionTone: 'knowledgeable' },
    ],
  },

  // ── 18. Post-Launch UX Review ────────────────────────────────────────────────
  {
    id: 'ux-18',
    title: 'Post-Launch UX Analytics Review',
    description: 'Designer Dana and a product manager review heatmaps, session recordings, and funnel analytics three months after a product launch.',
    participants: ['Dana', 'PM'],
    category: 'UI/UX',
    difficulty: 'advanced',
    lines: [
      { id: 'ux18-1', characterId: 'PM',   englishText: 'The heatmaps show users clicking the logo in the top left expecting it to go to their dashboard, but it goes to the homepage instead.', vietnameseText: 'Heatmap cho thấy người dùng nhấp vào logo ở góc trên bên trái mong đợi chuyển đến dashboard của họ, nhưng nó lại đến trang chủ.', emotionTone: 'concerned' },
      { id: 'ux18-2', characterId: 'Dana', englishText: 'Classic navigation pattern mismatch. Logged-in users expect the logo to link to their home base, not the marketing homepage.', vietnameseText: 'Không khớp mẫu điều hướng cổ điển. Người dùng đã đăng nhập mong đợi logo liên kết đến trang chủ của họ, không phải trang chủ marketing.', emotionTone: 'analytical' },
      { id: 'ux18-3', characterId: 'PM',   englishText: 'The session recordings also show many users abandoning the settings page. Any idea why?', vietnameseText: 'Các bản ghi phiên cũng cho thấy nhiều người dùng từ bỏ trang cài đặt. Bạn có ý kiến tại sao không?', emotionTone: 'curious' },
      { id: 'ux18-4', characterId: 'Dana', englishText: 'The settings are likely too comprehensive — showing all options at once overwhelms casual users. We should group and progressively disclose them.', vietnameseText: 'Các cài đặt có thể quá toàn diện — hiển thị tất cả các tùy chọn cùng một lúc làm choáng ngợp người dùng thông thường. Chúng ta nên nhóm và tiết lộ chúng dần dần.', emotionTone: 'problem-solving' },
      { id: 'ux18-5', characterId: 'PM',   englishText: 'Good call. On the positive side, the new search is getting a lot of use — much more than we expected.', vietnameseText: 'Nhận xét đúng. Mặt tích cực, chức năng tìm kiếm mới đang được sử dụng rất nhiều — nhiều hơn chúng ta mong đợi.', emotionTone: 'positive' },
      { id: 'ux18-6', characterId: 'Dana', englishText: 'Interesting. That suggests users are not finding things through navigation. The information architecture may need a rethink.', vietnameseText: 'Thú vị. Điều đó cho thấy người dùng không tìm thấy mọi thứ qua điều hướng. Kiến trúc thông tin có thể cần được xem xét lại.', emotionTone: 'insightful' },
      { id: 'ux18-7', characterId: 'PM',   englishText: 'Shall we run a tree test to validate a new site structure before building anything?', vietnameseText: 'Chúng ta có nên chạy tree test để xác nhận cấu trúc trang web mới trước khi xây dựng bất cứ thứ gì không?', emotionTone: 'pragmatic' },
    ],
  },

  // ── 19. Information Architecture ────────────────────────────────────────────
  {
    id: 'ux-19',
    title: 'Planning Information Architecture',
    description: 'UX designer Owen and a content strategist map out the navigation structure and content taxonomy for a large corporate intranet.',
    participants: ['Owen', 'Content'],
    category: 'UI/UX',
    difficulty: 'advanced',
    lines: [
      { id: 'ux19-1', characterId: 'Owen',    englishText: 'Before we start wireframing, we need to agree on the top-level navigation categories. I have done a card sort with twenty employees.', vietnameseText: 'Trước khi bắt đầu wireframe, chúng ta cần đồng ý về các danh mục điều hướng cấp cao nhất. Tôi đã thực hiện phân loại thẻ với hai mươi nhân viên.', emotionTone: 'methodical' },
      { id: 'ux19-2', characterId: 'Content', englishText: 'What did the clusters look like? Did employees agree on how to group things?', vietnameseText: 'Các cụm trông như thế nào? Nhân viên có đồng ý về cách nhóm mọi thứ không?', emotionTone: 'curious' },
      { id: 'ux19-3', characterId: 'Owen',    englishText: 'Mostly yes. The strongest clusters were: Company News, HR and Benefits, Tools and Systems, and Team Pages.', vietnameseText: 'Hầu hết là có. Các cụm mạnh nhất là: Tin tức công ty, Nhân sự và Phúc lợi, Công cụ và Hệ thống, và Trang nhóm.', emotionTone: 'informative' },
      { id: 'ux19-4', characterId: 'Content', englishText: 'That aligns with what I see in our analytics. HR pages are by far the most visited section.', vietnameseText: 'Điều đó phù hợp với những gì tôi thấy trong phân tích của chúng ta. Các trang HR là phần được truy cập nhiều nhất.', emotionTone: 'confirming' },
      { id: 'ux19-5', characterId: 'Owen',    englishText: 'In that case, HR and Benefits should appear second in the top navigation, right after the home feed.', vietnameseText: 'Trong trường hợp đó, Nhân sự và Phúc lợi nên xuất hiện thứ hai trong điều hướng trên cùng, ngay sau nguồn cấp dữ liệu chính.', emotionTone: 'decisive' },
      { id: 'ux19-6', characterId: 'Content', englishText: 'Agreed. What about content that spans multiple categories, like the company directory? Where should it live?', vietnameseText: 'Đồng ý. Còn nội dung trải dài nhiều danh mục, như danh bạ công ty thì sao? Nó nên ở đâu?', emotionTone: 'problem-solving' },
      { id: 'ux19-7', characterId: 'Owen',    englishText: 'Cross-cutting content like that works best as a global search result rather than buried in a category. We should also expose it in the main search bar.', vietnameseText: 'Nội dung xuyên suốt như vậy hoạt động tốt nhất như kết quả tìm kiếm toàn cầu hơn là ẩn trong một danh mục. Chúng ta cũng nên hiển thị nó trong thanh tìm kiếm chính.', emotionTone: 'strategic' },
    ],
  },

  // ── 20. Design Tool Selection ────────────────────────────────────────────────
  {
    id: 'ux-20',
    title: 'Choosing a Design Tool: Figma vs Alternatives',
    description: 'Designer Pam and her team lead evaluate whether to standardise on Figma across the entire design organisation or allow other tools.',
    participants: ['Pam', 'TeamLead'],
    category: 'UI/UX',
    difficulty: 'intermediate',
    lines: [
      { id: 'ux20-1', characterId: 'TeamLead', englishText: 'Some designers are still using Sketch and others use Adobe XD. We need to standardise. What is your recommendation?', vietnameseText: 'Một số designer vẫn đang sử dụng Sketch và những người khác dùng Adobe XD. Chúng ta cần chuẩn hóa. Bạn đề xuất gì?', emotionTone: 'decisive' },
      { id: 'ux20-2', characterId: 'Pam',      englishText: 'I strongly recommend Figma. The main reason is real-time collaboration — the whole team can work in the same file simultaneously.', vietnameseText: 'Tôi mạnh mẽ khuyến nghị Figma. Lý do chính là cộng tác thời gian thực — cả nhóm có thể làm việc trong cùng một tệp đồng thời.', emotionTone: 'confident' },
      { id: 'ux20-3', characterId: 'TeamLead', englishText: 'How does it compare for developer handoff compared to what we currently use?', vietnameseText: 'Nó so sánh như thế nào về bàn giao cho developer so với những gì chúng ta hiện đang sử dụng?', emotionTone: 'analytical' },
      { id: 'ux20-4', characterId: 'Pam',      englishText: 'Figma Dev Mode provides auto-generated CSS, spacing tokens, and asset export all in one place. It eliminates most of the manual spec-writing.', vietnameseText: 'Figma Dev Mode cung cấp CSS được tạo tự động, spacing token và xuất tài sản tất cả trong một nơi. Nó loại bỏ hầu hết việc viết thông số kỹ thuật thủ công.', emotionTone: 'enthusiastic' },
      { id: 'ux20-5', characterId: 'TeamLead', englishText: 'What about the learning curve for designers currently on Sketch? That migration could slow us down.', vietnameseText: 'Còn về đường cong học tập cho các designer hiện đang dùng Sketch thì sao? Việc di chuyển đó có thể làm chậm chúng ta.', emotionTone: 'concerned' },
      { id: 'ux20-6', characterId: 'Pam',      englishText: 'Sketch and Figma share most core concepts. I ran a pilot with three Sketch users and they were productive within two weeks.', vietnameseText: 'Sketch và Figma chia sẻ hầu hết các khái niệm cốt lõi. Tôi đã chạy thử nghiệm với ba người dùng Sketch và họ đã làm việc hiệu quả trong vòng hai tuần.', emotionTone: 'reassuring' },
      { id: 'ux20-7', characterId: 'TeamLead', englishText: 'That is quicker than I expected. Let us proceed with a full migration over the next quarter and make Figma the standard.', vietnameseText: 'Nhanh hơn tôi mong đợi. Hãy tiến hành di chuyển đầy đủ trong quý tới và biến Figma thành tiêu chuẩn.', emotionTone: 'decided' },
    ],
  },
];
