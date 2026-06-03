/* ——— PORTAL LINKS ——— */
const allLinks = [
  /* Academics */
  { name: 'NTULearn', desc: 'Course materials, assignments, announcements', cat: 'Academics', url: 'https://ntulearn.ntu.edu.sg/ultra/institution-page' },
  { name: 'Degree Audit', desc: 'View grades and track AU progress', cat: 'Academics', url: 'https://wish.wis.ntu.edu.sg/pls/webexe/ldap_login.login?w_url=https://wish.wis.ntu.edu.sg/pls/webexe/dars_result_ro.main_display' },
  { name: 'STARS', desc: 'Register for courses and plan timetable', cat: 'Academics', url: 'https://wish.wis.ntu.edu.sg/pls/webexe/ldap_login.login?w_url=https://wish.wis.ntu.edu.sg/pls/webexe/aus_stars_planner.main' },
  { name: 'Exam Seating', desc: 'Exam venue and seat number', cat: 'Academics', url: 'https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=1&p2=https://wis.ntu.edu.sg/webexe/owa/oes_main.main&extra=&pg=' },
  { name: 'Exam Timetable', desc: 'Exam schedule for current semester', cat: 'Academics', url: 'https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.main' },
  { name: 'Transcript', desc: 'View grades history', cat: 'Academics', url: 'https://wis.ntu.edu.sg/webexe/owa/request_transcript_und.LoginN?pType=SH' },
  { name: 'S/U Option', desc: 'Satisfactory/Unsatisfactory grading election', cat: 'Academics', url: 'https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=1&p2=https://wis.ntu.edu.sg/pls/webexe/aus_su_opt.display&extra=&pg=' },
  { name: 'Class Schedule', desc: 'Browse available classes for any module', cat: 'Academics', url: 'https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main' },
  { name: 'LOA Form', desc: 'Leave of absence application form', cat: 'Academics', url: 'https://entuedu.sharepoint.com/sites/Student/dept/sasd/oas/Shared%20Documents/Forms/display.aspx?id=%2Fsites%2FStudent%2Fdept%2Fsasd%2Foas%2FShared%20Documents%2FCandidature%2FShort%20Leave%20Application%20Form0324%2Epdf' },
  { name: 'Academic Calendar', desc: 'Semester dates, recess weeks, exam periods and public holidays', cat: 'Academics', url: 'https://www.ntu.edu.sg/education/academic-calendar' },
  { name: 'Library Catalogue', desc: 'Search NTU library holdings — books, journals, databases and e-resources', cat: 'Academics', url: 'https://libportal.ntu.edu.sg/' },
  { name: 'Turnitin', desc: 'Plagiarism detection and originality checking tool, accessed through NTULearn course shells', cat: 'Academics', url: 'https://ntulearn.ntu.edu.sg/ultra/institution-page' },
  { name: 'MOOC Transfer', desc: 'Credit transfer portal for approved online MOOCs. Submit completed certificates for AU recognition.', cat: 'Academics', url: 'https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=&p2=https://venus2.wis.ntu.edu.sg/MOOC/Student/Login.aspx&extra=&pg=' },
  { name: 'MOOC Guide', desc: "Approved MOOC platforms and eligibility for AU credit under NTU's recognition programme", cat: 'Academics', url: 'https://www.ntu.edu.sg/admissions/matriculation/mooc' },
  /* Career */
  { name: 'CareerAxis', desc: 'Internships, jobs and career events', cat: 'Career', url: 'https://careeraxis.ntu.edu.sg/students' },
  { name: 'Work Study Scheme', desc: 'Paid on-campus student opportunities that fit around your academic schedule', cat: 'Career', url: 'https://entuedu.sharepoint.com/sites/Student/dept/sasd/sao/SitePages/WSS/WSS.aspx' },
  /* Exchange */
  { name: 'Exchange Portal', desc: 'Semester exchanges and global programmes at partner universities worldwide', cat: 'Exchange', url: 'https://gem.ntu.edu.sg/' },
  { name: 'Course Matching', desc: 'Match overseas courses to NTU equivalents for credit transfer approval', cat: 'Exchange', url: 'https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=1&p2=https://wis.ntu.edu.sg/pls/lms/instep_past_subj_matching.show_rec_INSTEP' },
  /* Facilities */
  { name: 'Library Booking', desc: "Study rooms and library spaces across NTU's library network", cat: 'Facilities', url: 'https://libcalendar.ntu.edu.sg/' },
  { name: 'Facilities Booking', desc: 'Sports courts, function rooms and multi-purpose halls for club or personal use', cat: 'Facilities', url: 'https://ntu.facilitiesbooking.com/bookings.aspx' },
  { name: 'Sports & Rec Centre', desc: 'Book facilities at the Sports & Recreation Centre — gym, pools, courts and fitness classes', cat: 'Facilities', url: 'https://www.ntu.edu.sg/life-at-ntu/sports-and-recreation' },
  /* Finance */
  { name: 'Financial Aid', desc: 'Scholarships, bursaries, tuition grants and financial assistance for undergraduates', cat: 'Finance', url: 'https://www.ntu.edu.sg/admissions/undergraduate/financial-matters/financial-aid' },
  /* Housing */
  { name: 'Hall Portal', desc: 'Apply for on-campus housing, manage your hall room and submit maintenance requests', cat: 'Housing', url: 'https://ntusg.starrezhousing.com/StarRezStudentPortal/60E2C0B3/1/1/Home-Home?UrlToken=CFD12569' },
  /* Community */
  { name: 'NTU ConfessIt', desc: 'Anonymous confessions from the NTU student body — the unfiltered pulse of campus life', cat: 'Community', url: 'https://t.me/ntuconfessit' },
  { name: 'NTU Marketplace', desc: 'Student-to-student trading for textbooks, electronics, furniture and campus essentials', cat: 'Community', url: 'https://t.me/ntumarketplace' },
  { name: 'NTU Atlas Community', desc: 'Suggest new links, report broken ones and connect with fellow students', cat: 'Community', url: 'https://t.me/ntulinksss' },
  { name: 'OSA Clubs Directory', desc: 'Official NTU list of all recognised clubs and societies managed by the Office of Student Affairs', cat: 'Community', url: 'https://www.ntu.edu.sg/student-services/office-of-student-affairs/clubs-and-societies' },
  /* Campus Life */
  { name: 'Campus Shuttle', desc: 'Real-time NTU campus bus timings and routes — also available as the NTU Campus Shuttle mobile app', cat: 'Campus Life', url: 'https://transport.ntu.edu.sg/' },
  { name: 'Campus Map', desc: 'Interactive NTU campus map — find buildings, bus stops, canteens and facilities', cat: 'Campus Life', url: 'https://maps.ntu.edu.sg/maps' },
  { name: 'Food & Beverage', desc: 'NTU canteen locations, operating hours and food options across the campus', cat: 'Campus Life', url: 'https://www.ntu.edu.sg/life-at-ntu/amenities/foodandbeverage' },
  { name: 'Student Health Centre', desc: 'Book GP consultations, vaccinations and health screenings at the on-campus clinic', cat: 'Campus Life', url: 'https://www.ntu.edu.sg/life-at-ntu/student-health-services' },
  { name: 'Counselling Services', desc: 'Free and confidential counselling and psychological support for all NTU students', cat: 'Campus Life', url: 'https://www.ntu.edu.sg/student-services/welfare-counselling-guidance' },
  /* IT & Tech */
  { name: 'NTU VPN', desc: 'Access NTU intranet resources off-campus using the official Cisco AnyConnect VPN', cat: 'IT & Tech', url: 'https://ntuvpn.ntu.edu.sg/' },
  { name: 'eduroam Setup', desc: 'Connect to eduroam Wi-Fi on campus and at partner institutions worldwide', cat: 'IT & Tech', url: 'https://www.ntu.edu.sg/ntunetwork/eduroam' },
  { name: 'NTU Email', desc: 'Access your NTU student email inbox via Outlook — check regularly for official communications', cat: 'IT & Tech', url: 'https://outlook.office365.com/' },
  { name: 'Microsoft 365', desc: 'Free Microsoft 365 suite for NTU students — Word, Excel, PowerPoint, Teams and OneDrive', cat: 'IT & Tech', url: 'https://www.ntu.edu.sg/ntunetwork/microsoft-365' },
  { name: 'IT Service Desk', desc: 'Report IT issues, request software licences and get help with NTU tech services', cat: 'IT & Tech', url: 'https://entuedu.sharepoint.com/sites/Student/dept/imsc/SitePages/Home.aspx' },
  /* Student Services */
  { name: 'Student Service Centre', desc: 'One-stop counter for academic records, letters, graduation matters and general admin', cat: 'Student Services', url: 'https://www.ntu.edu.sg/student-services/student-service-centre' },
  { name: 'Office of Student Affairs', desc: 'OSA oversees student life, welfare, clubs, and non-academic student matters', cat: 'Student Services', url: 'https://www.ntu.edu.sg/student-services/office-of-student-affairs' },
  { name: 'Global Relations Office', desc: 'Support and resources for international students studying at NTU', cat: 'Student Services', url: 'https://www.ntu.edu.sg/gro' },
  { name: 'Graduation', desc: 'Graduation eligibility checks, ceremony registration and collection of certificates', cat: 'Student Services', url: 'https://www.ntu.edu.sg/student-services/academic-services/graduation' },
];

/* ——— CLUBS DATA ——— */
/* NOTE: Verify all Instagram handles and Telegram links before publishing.
   instagram: handle only (no @, no URL) — null if unavailable
   telegram: full URL — null if unavailable */
const allClubs = [
  /* Sports */
  { name: 'Badminton Club', type: 'Sports', desc: 'Competitive and recreational badminton for all skill levels, with inter-varsity training.', instagram: 'ntubadminton', telegram: null },
  { name: 'Basketball Club', type: 'Sports', desc: "Men's and women's basketball teams competing in inter-varsity leagues and friendly tournaments.", instagram: 'ntu.basketball', telegram: null },
  { name: 'Football Club', type: 'Sports', desc: "NTU's flagship football club, fielding teams in the Institute-Varsity-Polytechnic (IVP) league.", instagram: 'ntufootball', telegram: null },
  { name: 'Swimming Club', type: 'Sports', desc: 'Competitive swimming and water polo, with training sessions in the NTU Olympic-size pool.', instagram: 'ntuswimmingclub', telegram: null },
  { name: 'Tennis Club', type: 'Sports', desc: 'Tennis training and inter-varsity competition for beginners through to advanced players.', instagram: 'ntutennisclub', telegram: null },
  { name: 'Rock Climbing Club', type: 'Sports', desc: 'Bouldering, lead and top-rope climbing sessions at the NTU climbing wall and beyond.', instagram: 'nturockclimbing', telegram: null },
  { name: 'Volleyball Club', type: 'Sports', desc: "Men's and women's volleyball teams with regular training and inter-varsity fixtures.", instagram: 'ntuvbc', telegram: null },
  { name: 'Table Tennis Club', type: 'Sports', desc: 'Casual and competitive table tennis for all levels, with IVP representation.', instagram: 'ntutabletennis', telegram: null },
  /* Arts */
  { name: 'Choir', type: 'Arts', desc: "NTU's premier choral ensemble performing Western classical and Asian repertoire at local and international events.", instagram: 'ntuchoir', telegram: null },
  { name: 'Symphonic Band', type: 'Arts', desc: 'Full concert band performing across Singapore and at international band festivals.', instagram: 'ntusymphonicband', telegram: null },
  { name: 'Dance Ensemble', type: 'Arts', desc: 'Contemporary and traditional dance performances, open to dancers of all backgrounds.', instagram: 'ntudance', telegram: null },
  { name: 'Drama Society', type: 'Arts', desc: 'English-language theatre productions, workshops and improv sessions throughout the year.', instagram: 'ntudrama', telegram: null },
  { name: 'Guitar Ensemble', type: 'Arts', desc: 'Classical and fingerstyle guitar ensemble with regular public performances and masterclasses.', instagram: 'ntuguitarensemble', telegram: null },
  /* Cultural */
  { name: 'Chinese Society', type: 'Cultural', desc: 'Celebrating Chinese culture through language, arts, festivals and community events.', instagram: 'ntuchinesociety', telegram: null },
  { name: 'Tamil Language Society', type: 'Cultural', desc: 'Promoting Tamil language, literature and South Indian culture within the NTU community.', instagram: 'ntutamilsociety', telegram: null },
  { name: 'Malay Cultural Society', type: 'Cultural', desc: 'Preserving and promoting Malay language, arts and culture through performances and workshops.', instagram: 'ntumcs', telegram: null },
  { name: 'Korean Cultural Club', type: 'Cultural', desc: 'Korean language classes, K-pop, food events and cultural exchange within NTU.', instagram: 'ntukcc', telegram: null },
  { name: 'Japanese Cultural Club', type: 'Cultural', desc: 'Japanese language, anime, manga, food and cultural events for enthusiasts and learners.', instagram: 'ntujcc', telegram: null },
  { name: 'Indian Cultural Society', type: 'Cultural', desc: 'Celebrating the diversity of Indian culture through dance, music, festivals and food.', instagram: 'ntuindian', telegram: null },
  /* Academic */
  { name: 'IEEE NTU Student Branch', type: 'Academic', desc: 'IEEE student chapter hosting technical workshops, industry talks and networking events for engineers.', instagram: 'ieeestu.ntu', telegram: null },
  { name: 'NTU Computing Society', type: 'Academic', desc: 'Hackathons, coding competitions, tech talks and career networking for computing students.', instagram: 'ntucomputingsociety', telegram: 'https://t.me/NTUComputingSociety' },
  { name: 'Entrepreneurship Society', type: 'Academic', desc: 'Startup pitches, founder talks and innovation bootcamps for aspiring student entrepreneurs.', instagram: 'ntues', telegram: null },
  { name: 'Investment Club', type: 'Academic', desc: 'Stock pitching competitions, investment simulations and finance industry networking for NTU students.', instagram: 'ntuinvestmentclub', telegram: null },
  /* Uniformed */
  { name: 'Naval Volunteer Force', type: 'Uniformed', desc: "NTU's uniformed naval unit under NUSS — seamanship, leadership and community service.", instagram: 'ntunvf', telegram: null },
  { name: "St John's Brigade", type: 'Uniformed', desc: 'First aid training, community service and emergency response as part of St John Brigade Singapore.', instagram: 'ntusjab', telegram: null },
  { name: 'Red Cross Youth', type: 'Uniformed', desc: 'Humanitarian volunteering, disaster preparedness and blood donation drives on campus.', instagram: 'ntu_redcross', telegram: null },
  /* Welfare */
  { name: "Students' Union", type: 'Welfare', desc: "The official representative body of NTU students — advocating for student welfare and organising campus-wide events.", instagram: 'ntusu', telegram: null },
  { name: 'Project Heartware', type: 'Welfare', desc: 'Student-run voluntary welfare organisation connecting NTU students with community service opportunities.', instagram: 'projectheartware', telegram: null },
  { name: 'Green Club', type: 'Welfare', desc: 'Sustainability initiatives, eco-campaigns and green living advocacy across the NTU campus.', instagram: 'ntugreenclub', telegram: null },
];
