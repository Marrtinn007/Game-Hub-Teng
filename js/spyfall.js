/* ══ SPYFALL DATA ════════════════════════ */
const SPY_LOCATIONS=[
  {name:'โรงพยาบาล',e:'🏥',roles:['หมอ','พยาบาล','คนไข้','แพทย์ฉุกเฉิน','คนเยี่ยมไข้','นักเรียนแพทย์','พนักงานส่งยา','เจ้าหน้าที่รังสี','นักกายภาพบำบัด','แม่บ้าน','รปภ.','พนักงานต้อนรับ']},
  {name:'ร้านทำฟัน',e:'🦷',roles:['ทันตแพทย์','ผู้ช่วยทันตแพทย์','คนไข้','พนักงานต้อนรับ','นักเรียนทันตแพทย์','คนรอ','เจ้าของคลินิก','ช่างทำฟันปลอม','คนไข้กลัวฟัน','พนักงานเก็บเงิน','แม่บ้าน','ตัวแทนขายอุปกรณ์']},
  {name:'ร้านตัดผม',e:'💈',roles:['ช่างตัดผม','ลูกค้า','เด็กฝึกงาน','คนรอคิว','เจ้าของร้าน','ช่างสระผม','คนโทรจองคิว','ลูกค้าจู้จี้','พนักงานเก็บเงิน','ช่างทำสี','แม่บ้าน','ลูกค้าขาประจำ']},
  {name:'สปา/นวดแผนไทย',e:'💆',roles:['นักนวด','ลูกค้า','เจ้าของร้าน','พนักงานต้อนรับ','นักนวดหน้า','พนักงานเสิร์ฟชา','ลูกค้าจองห้องพัก','ช่างทำเล็บ','ล่าม','ผู้ตรวจสอบมาตรฐาน','แม่บ้าน','นักนวดฝึกหัด']},
  {name:'ธนาคาร',e:'🏦',roles:['พนักงานเคาน์เตอร์','ผู้จัดการ','ลูกค้า','รปภ.','โจรปล้นธนาคาร','พนักงานนับเงิน','ที่ปรึกษาการเงิน','พนักงานสินเชื่อ','คนรอคิว','นักสืบ','แม่บ้าน','พนักงาน IT']},
  {name:'สนามบิน',e:'✈️',roles:['นักบิน','แอร์โฮสเตส','ผู้โดยสาร','เจ้าหน้าที่ตรวจหนังสือเดินทาง','พนักงานเช็คอิน','เจ้าหน้าที่ศุลกากร','พนักงานขนกระเป๋า','รปภ.','คนรอรับคน','พนักงานร้านค้า','คนพลาดเที่ยวบิน','ไกด์']},
  {name:'บนเครื่องบิน',e:'🛫',roles:['กัปตัน','แอร์โฮสเตส','ผู้โดยสารชั้นประหยัด','ผู้โดยสารชั้นธุรกิจ','เด็กร้องไห้','คนกลัวบิน','คนนอนหลับ','คนกินเยอะ','นักบินผู้ช่วย','คนอยากเข้าห้องน้ำ','สายลับ','ผู้โดยสารวีไอพี']},
  {name:'สถานีรถไฟ',e:'🚉',roles:['คนขับรถไฟ','ผู้โดยสาร','พนักงานขายตั๋ว','คนรอ','พนักงานยกกระเป๋า','เจ้าหน้าที่รักษาความปลอดภัย','พ่อค้าขายของในรถไฟ','คนพลาดรถ','ผู้ตรวจตั๋ว','แม่บ้าน','นักท่องเที่ยว','คนหลับเลยสถานี']},
  {name:'เรือสำราญ',e:'🛳️',roles:['กัปตัน','นักท่องเที่ยว','พ่อครัว','พนักงานบาร์','ดีเจ','พนักงานต้อนรับ','ไกด์ทัวร์','นักดนตรี','รปภ.','คนเมาเรือ','นักดำน้ำ','พนักงานแม่บ้าน']},
  {name:'สถานีรถเมล์',e:'🚌',roles:['คนขับรถเมล์','ผู้โดยสาร','พนักงานเก็บตั๋ว','คนขายของ','คนเร่ร่อน','เจ้าหน้าที่','คนรอนาน','คนวิ่งตามรถ','นักเรียน','แม่บ้านถือถุงเยอะ','คนฟังเพลง','คนพลาดรถ']},
  {name:'ร้านอาหารหรู',e:'🍽️',roles:['เชฟ','บริกร','ลูกค้าคู่รัก','ผู้จัดการ','นักวิจารณ์อาหาร','โซมเมอลิเย่','พนักงานล้างจาน','คนจองโต๊ะ','เจ้าของร้าน','ผู้ช่วยเชฟ','พนักงานต้อนรับ','ลูกค้าวีไอพี']},
  {name:'ร้านหมูกระทะ',e:'🥩',roles:['เจ้าของร้าน','พนักงานเสิร์ฟ','ลูกค้ากลุ่มเพื่อน','คนเติมน้ำซุป','แคชเชียร์','พ่อครัว','คนสั่งเพิ่มตลอด','พนักงานเก็บจาน','ลูกค้าขาประจำ','คนแพ้อาหาร','พนักงานล้างจาน','คนรอคิว']},
  {name:'คาเฟ่',e:'☕',roles:['บาริสต้า','ลูกค้าทำงานแล็ปท็อป','เจ้าของร้าน','คนรอเพื่อน','คนถ่ายรูป','พนักงานต้อนรับ','ช่างซ่อมเครื่องชงกาแฟ','นักรีวิว','คนนั่งนาน','ลูกค้าสั่งซับซ้อน','พนักงานทำเบเกอรี่','แมวร้าน']},
  {name:'บาร์/ผับ',e:'🍺',roles:['บาร์เทนเดอร์','ลูกค้าขาประจำ','ดีเจ','รปภ.','คนมาคนเดียว','พนักงานเสิร์ฟ','เจ้าของร้าน','คนเมา','คนฉลองวันเกิด','นักดนตรีสด','พนักงานล้างแก้ว','คนแอบถ่ายรูป']},
  {name:'โรงหนัง',e:'🎬',roles:['พนักงานขายตั๋ว','พนักงานขายป๊อปคอร์น','คนดูหนัง','ผู้กำกับ','คนคุยโทรศัพท์','คนมาสาย','คนนอนหลับ','รปภ.','พนักงานทำความสะอาด','คนกินเสียงดัง','ผู้จัดการ','คู่รักแอบจูบ']},
  {name:'โรงเรียน',e:'🏫',roles:['ครู','นักเรียน','ผู้อำนวยการ','แม่บ้าน','ผู้ปกครอง','ครูพลศึกษา','นักเรียนเกเร','ครูใหม่','พนักงานขายโรงอาหาร','รปภ.','นักเรียนหัวดี','เจ้าหน้าที่ธุรการ']},
  {name:'มหาวิทยาลัย',e:'🎓',roles:['อาจารย์','นักศึกษา','เจ้าหน้าที่ทะเบียน','นักศึกษาใหม่','รปภ.','นักศึกษาต่างชาติ','พนักงานโรงอาหาร','หัวหน้าภาควิชา','นักศึกษาฝึกงาน','คนขายของหน้ามหาวิทยาลัย','นักวิจัย','นักศึกษาที่ไม่เคยมาเรียน']},
  {name:'ห้องสมุด',e:'📚',roles:['บรรณารักษ์','นักเรียนอ่านหนังสือ','คนหลับ','เจ้าหน้าที่','คนค้นหนังสือ','นักวิจัย','คนคุยเสียงดัง','อาจารย์','นักเรียนก๊อปงาน','คนยืมหนังสือ','เจ้าหน้าที่ IT','คนหาที่นั่ง']},
  {name:'คลินิกหมอ',e:'🩺',roles:['หมอ','พยาบาล','คนไข้','พนักงานต้อนรับ','เภสัชกร','คนไข้รอนาน','ผู้ช่วยหมอ','เจ้าของคลินิก','พนักงานเก็บเงิน','คนพาผู้สูงอายุมา','นักศึกษาแพทย์ฝึกงาน','แม่บ้าน']},
  {name:'โรงยิม/ฟิตเนส',e:'🏋️',roles:['เทรนเนอร์','สมาชิกขาประจำ','คนมาครั้งแรก','พนักงานต้อนรับ','คนเซลฟี่','คนใช้เครื่องนาน','ผู้จัดการ','คนสอนโยคะ','คนสอนแอโรบิก','นักกีฬา','คนขายซัพพลีเมนต์','แม่บ้าน']},
  {name:'สวนสนุก',e:'🎡',roles:['คนขับรถไฟเหาะ','ผู้เยี่ยมชม','พ่อแม่พาลูก','พนักงานขายขนม','คนกลัวความสูง','พนักงานดูแลเครื่องเล่น','ช่างซ่อม','พนักงานขายบัตร','มาสคอต','นักท่องเที่ยวต่างชาติ','รปภ.','เด็กร้องไห้หาพ่อแม่']},
  {name:'คอนเสิร์ต',e:'🎤',roles:['นักร้อง','แฟนคลับ','ช่างเสียง','ช่างภาพ','รปภ.','ผู้จัดงาน','สไตลิสต์','นักดนตรีแบ็คอัพ','พิธีกร','พนักงานขายของที่ระลึก','คนแอบเข้า','VIP']},
  {name:'สนามกีฬา',e:'⚽',roles:['นักฟุตบอล','โค้ช','กรรมการ','แฟนบอล','นักข่าว','ผู้จัดการทีม','พนักงานขายน้ำ','ช่างภาพ','พนักงานสนาม','นักฟุตบอลสำรอง','หมอทีม','คนขายตั๋ว']},
  {name:'ร้านเกม/อีสปอร์ต',e:'🎮',roles:['คนเล่นเกม','เจ้าของร้าน','คนดู','ผู้จัดการแข่ง','เด็กขายน้ำ','นักแคสเกม','โค้ชทีม','สปอนเซอร์','แฟนๆ','ช่างคอมพิวเตอร์','นักข่าวเกม','คนเล่นแพ้แล้วโกรธ']},
  {name:'สนามบาสเกตบอล',e:'🏀',roles:['นักบาส','โค้ช','กรรมการ','แฟนกีฬา','คนขายขนม','ผู้จัดการทีม','หมอทีม','นักบาสสำรอง','ช่างภาพ','นักข่าว','เจ้าหน้าที่สนาม','มาสคอต']},
  {name:'ห้างสรรพสินค้า',e:'🛍️',roles:['พนักงานขาย','ลูกค้า','รปภ.','แม่บ้าน','เด็กหลงพ่อแม่','ผู้จัดการ','พนักงานแคชเชียร์','พนักงานดูแลลิฟต์','คนโปรโมทสินค้า','ช่างซ่อมบำรุง','คนถือถุงเต็มมือ','นักสืบลับห้าง']},
  {name:'ตลาดนัด',e:'🏪',roles:['พ่อค้า','แม่ค้า','ลูกค้าต่อราคา','คนหิ้วของเต็มมือ','พนักงานขายเสื้อผ้า','คนขายอาหาร','เจ้าของที่','รปภ.','คนขายของเก่า','นักท่องเที่ยว','แมวจรจัด','คนซื้อของปลอม']},
  {name:'ซูเปอร์มาร์เก็ต',e:'🛒',roles:['แคชเชียร์','ลูกค้า','พนักงานเติมสินค้า','ผู้จัดการ','คนลืมรถเข็น','พนักงานดูแลผัก','นักชิมสินค้า','คนซื้อเยอะมาก','รปภ.','คนหาของไม่เจอ','เด็กร้องขนม','พนักงานส่งของ']},
  {name:'ร้านสะดวกซื้อ',e:'🏬',roles:['พนักงานกะดึก','ลูกค้าตี 3','พนักงานทำความสะอาด','คนซื้อเบียร์','คนซื้อบุหรี่','คนอุ่นอาหาร','พนักงานเติมของ','คนซื้อมาม่า','ผู้จัดการ','คนหนีออกจากบ้าน','คนรอรถ','พนักงานฝึกหัด']},
  {name:'ตลาดปลา',e:'🐟',roles:['พ่อค้าปลา','แม่บ้านซื้อกับข้าว','คนขนของ','ลูกค้าต่อราคา','แมว','พนักงานทำความสะอาด','คนขายน้ำแข็ง','นักท่องเที่ยว','ช่างภาพ','เจ้าของแพปลา','คนขายอาหารทะเล','พ่อค้าส่ง']},
  {name:'ชายหาด',e:'🏖️',roles:['นักท่องเที่ยว','ไลฟ์การ์ด','พนักงานเก็บขยะ','คนขายของ','นักกีฬาทางน้ำ','คนทาครีมกันแดด','คนเล่นวอลเลย์บอลชายหาด','ช่างภาพ','เจ้าของร้านเช่าเก้าอี้','คนหลับริมทะเล','คนว่ายน้ำไม่เป็น','เด็กเล่นทราย']},
  {name:'ป่า/อุทยาน',e:'🌲',roles:['นักเดินป่า','เจ้าหน้าที่ป่าไม้','ช่างภาพสัตว์','ไกด์นำทาง','คนหลงป่า','นักวิจัยสัตว์ป่า','คนเก็บเห็ด','คนล่าสัตว์ผิดกฎหมาย','เจ้าหน้าที่พิทักษ์ป่า','นักท่องเที่ยว','คนตั้งแคมป์','นักชีววิทยา']},
  {name:'ฟาร์ม',e:'🚜',roles:['เกษตรกร','สัตวแพทย์','คนงาน','นักท่องเที่ยว','คนรีดนม','คนให้อาหารสัตว์','ช่างซ่อมเครื่องจักร','นักวิจัยเกษตร','พ่อค้ารับซื้อผลผลิต','เจ้าของฟาร์ม','คนขับรถไถ','เด็กฝึกงาน']},
  {name:'สวนสาธารณะ',e:'🌳',roles:['คนวิ่งออกกำลังกาย','คนเลี้ยงสุนัข','คนอ่านหนังสือ','เด็กเล่น','คนขายลูกโป่ง','คนนั่งเฉยๆ','คนเล่นโยคะ','คนถ่ายรูป','คนจูงสุนัข','คนให้อาหารนก','คนฝึกไทชิ','คู่รักนั่งคุย']},
  {name:'ภูเขา',e:'⛰️',roles:['นักปีนเขา','ไกด์','คนขายของที่ระลึก','ช่างภาพ','คนเพิ่งล้มหกล้ม','นักธรรมชาติวิทยา','เจ้าหน้าที่กู้ภัย','คนตั้งแคมป์','นักวิ่งเทรล','คนมาไหว้พระ','พระบนยอดเขา','นักอุตุนิยมวิทยา']},
  {name:'พิพิธภัณฑ์',e:'🏛️',roles:['ภัณฑารักษ์','นักท่องเที่ยว','ไกด์','นักเรียนทัศนศึกษา','รปภ.','นักประวัติศาสตร์','ช่างภาพ','อาสาสมัคร','นักวิจัย','คนขายบัตร','ครู','คนหลับในพิพิธภัณฑ์']},
  {name:'วัด',e:'⛩️',roles:['พระ','นักท่องเที่ยว','คนมาทำบุญ','เณร','คนขายพวงมาลัย','แม่ชี','คนทอดผ้าป่า','ช่างภาพ','คนขายอาหาร','ไกด์','ผู้ดูแลวัด','นักวิชาการศาสนา']},
  {name:'สถานีตำรวจ',e:'🚔',roles:['ตำรวจ','ผู้ต้องสงสัย','พยาน','ทนาย','คนมาแจ้งความ','สารวัตร','นักสืบ','ล่าม','ผู้ต้องขัง','เจ้าหน้าที่ธุรการ','ตำรวจจราจร','คนมารับปากคำ']},
  {name:'ศาล',e:'⚖️',roles:['ผู้พิพากษา','ทนายฝ่ายโจทก์','ทนายฝ่ายจำเลย','จำเลย','พยาน','ลูกขุน','อัยการ','เจ้าหน้าที่ศาล','นักข่าว','ผู้สังเกตการณ์','ล่าม','ผู้เสียหาย']},
  {name:'สถานทูต',e:'🏢',roles:['เจ้าหน้าที่กงสุล','คนขอวีซ่า','ล่าม','รปภ.','นักการทูต','เจ้าหน้าที่ตรวจเอกสาร','คนรอคิว','นักข่าว','คนทำพาสปอร์ตหาย','เจ้าหน้าที่ประสานงาน','นักศึกษาต่างชาติ','นักธุรกิจ']},
  {name:'สถานีอวกาศ',e:'🚀',roles:['นักบินอวกาศ','วิศวกร','นักวิทยาศาสตร์','หุ่นยนต์','ผู้บัญชาการ','นักชีววิทยาอวกาศ','เจ้าหน้าที่ควบคุมภาคพื้นดิน','นักฟิสิกส์','นักดาราศาสตร์','ช่างซ่อมบำรุง','นักข่าว','นักท่องเที่ยวอวกาศ']},
  {name:'เรือดำน้ำ',e:'🤿',roles:['กัปตัน','นักดำน้ำ','วิศวกร','นักวิทยาศาสตร์','พ่อครัว','นักสื่อสาร','เจ้าหน้าที่อาวุธ','แพทย์','นักเดินเรือ','ผู้บัญชาการ','เจ้าหน้าที่ซ่อมบำรุง','นักศึกษาฝึกงาน']},
  {name:'ฐานทัพ',e:'🪖',roles:['ทหาร','นายพล','สายลับ','พ่อครัวทหาร','เจ้าหน้าที่ข่าวกรอง','นักบินรบ','แพทย์ทหาร','เจ้าหน้าที่อาวุธ','ทหารใหม่','เจ้าหน้าที่สื่อสาร','รปภ.','นักวิเคราะห์']},
  {name:'โรงไฟฟ้านิวเคลียร์',e:'⚛️',roles:['วิศวกร','นักฟิสิกส์','เจ้าหน้าที่ความปลอดภัย','ผู้ตรวจสอบ','คนงาน','ผู้อำนวยการ','นักวิทยาศาสตร์นิวเคลียร์','เจ้าหน้าที่ควบคุม','ช่างซ่อม','นักข่าว','เจ้าหน้าที่รัฐ','นักสิ่งแวดล้อม']},
  {name:'เกาะร้าง',e:'🏝️',roles:['คนรอดจากเรืออัปปาง','นักสำรวจ','โจรสลัด','คนพื้นเมือง','คนมาช่วยเหลือ','นักชีววิทยา','ช่างภาพ','คนหนีสังคม','ทหาร','นักโบราณคดี','คนหาสมบัติ','คนถ่ายรายการ Survivor']},
  {name:'โรงแรม 5 ดาว',e:'🏨',roles:['คอนเซียร์จ','แขกผู้เข้าพัก','เจ้าของโรงแรม','แม่บ้าน','พ่อครัว','บาร์เทนเดอร์','พนักงานยกกระเป๋า','พนักงานต้อนรับ','ผู้จัดการ','แขกวีไอพี','ช่างซ่อมบำรุง','นักรีวิว']},
  {name:'สนามบาสเกตบอล (ใน)',e:'🏀',roles:['นักบาส','โค้ช','กรรมการ','แฟนกีฬา','คนขายขนม','ผู้จัดการทีม','หมอทีม','นักบาสสำรอง','ช่างภาพ','นักข่าว','เจ้าหน้าที่สนาม','มาสคอต']},
  {name:'บ้านผีสิง',e:'👻',roles:['นักสืบ','นักพาราจิต','คนกล้าเข้าไป','คนกลัว','ผีเจ้าของบ้าน','คนถ่ายยูทูบ','คนท้าทาย','นักประวัติศาสตร์','หมอผี','คนบ้าใกล้เคียง','ทีมกู้ภัย','คนซื้อบ้าน']},
  {name:'หอพัก/อพาร์ทเม้นต์',e:'🏠',roles:['เจ้าของหอ','ผู้เช่า','แม่บ้าน','คนซ่อม','เพื่อนบ้านเสียงดัง','คนส่งของ','นักศึกษา','คนเพิ่งย้ายเข้า','คนค้างค่าเช่า','เพื่อนมาเยี่ยม','ผู้เช่าชั้นบน','รปภ.']},
  {name:'เรือนจำ',e:'🔒',roles:['ผู้คุม','นักโทษ','ทนาย','นักโทษคดีเล็ก','หัวหน้าแก๊งในคุก','แพทย์','นักจิตวิทยา','เจ้าหน้าที่รับตัว','นักโทษใหม่','ผู้อำนวยการเรือนจำ','นักสังคมสงเคราะห์','นักข่าว']},
  {name:'โรงละคร/เวที',e:'🎭',roles:['นักแสดง','ผู้กำกับ','ช่างแต่งหน้า','คนดู','เจ้าหน้าที่ฉาก','นักแสดงนำ','นักแสดงประกอบ','คนตัดเย็บเครื่องแต่งกาย','ผู้จัดการเวที','พิธีกร','ผู้ช่วยผู้กำกับ','นักวิจารณ์ละคร']},
  {name:'สตูดิโอถ่ายทำ',e:'🎥',roles:['ผู้กำกับ','นักแสดง','ช่างกล้อง','แมคอัป','โปรดิวเซอร์','ผู้ช่วยกำกับ','ช่างแสง','ช่างเสียง','สไตลิสต์','นักแสดงแทน','คนถือบท','ผู้ตรวจสอบฉาก']},
  {name:'งานแต่งงาน',e:'💒',roles:['เจ้าบ่าว','เจ้าสาว','แขกรับเชิญ','MC','ช่างภาพ','พ่อแม่เจ้าสาว','พ่อแม่เจ้าบ่าว','เพื่อนเจ้าสาว','เพื่อนเจ้าบ่าว','พ่อครัว','พนักงานเสิร์ฟ','คนมาไม่ได้รับเชิญ']},
  {name:'งานศพ',e:'⚰️',roles:['พระ','ญาติผู้เสียชีวิต','เพื่อน','คนไม่รู้จักเจ้าภาพ','พิธีกร','คนร้องไห้มากสุด','ช่างภาพ','คนมาไม่ทัน','คนกินเลี้ยงงานศพ','พนักงานฌาปนสถาน','คนดูแลดอกไม้','เด็กๆ ที่ไม่รู้เรื่อง']},
  {name:'ร้านซ่อมมือถือ',e:'📱',roles:['ช่างซ่อม','ลูกค้าโทรศัพท์แตก','เจ้าของร้าน','คนรอ','คนต่อรองราคา','ลูกค้าซื้อมือถือมือสอง','ช่างฝึกหัด','พนักงานขายอุปกรณ์','คนเอาของมาฝาก','ลูกค้าขาประจำ','คนโมโหเพราะซ่อมไม่หาย','ตัวแทนซัพพลายเออร์']},
  {name:'ห้องแล็บ',e:'🔬',roles:['นักวิทยาศาสตร์','ผู้ช่วยวิจัย','ศาสตราจารย์','นักศึกษาฝึกงาน','นักชีววิทยา','นักเคมี','เจ้าหน้าที่ความปลอดภัย','ผู้ตรวจสอบ','สปอนเซอร์งานวิจัย','นักฟิสิกส์','แม่บ้านห้องแล็บ','ผู้อำนวยการสถาบัน']},
  {name:'ออฟฟิศบริษัท IT',e:'💻',roles:['โปรแกรมเมอร์','ผู้จัดการ','HR','นักออกแบบ','บอส','นักการตลาด','เจ้าหน้าที่ IT','นักบัญชี','พนักงานใหม่','คนทำงานตลอดเวลา','ผู้ช่วยผู้บริหาร','นักลงทุน']},
  {name:'โรงงาน',e:'🏭',roles:['คนงาน','วิศวกร','ผู้จัดการโรงงาน','เจ้าหน้าที่ความปลอดภัย','ช่างซ่อมเครื่องจักร','เจ้าของโรงงาน','พนักงานตรวจคุณภาพ','คนขับรถโฟล์คลิฟต์','พนักงานคลังสินค้า','นักบัญชี','เจ้าหน้าที่สิ่งแวดล้อม','รปภ.']},
  {name:'ร้านสัก/เจาะ',e:'💉',roles:['ช่างสัก','ลูกค้าขาประจำ','คนมาครั้งแรก','คนกลัวเจ็บ','เจ้าของร้าน','ช่างเจาะ','คนออกแบบลาย','ลูกค้าเปลี่ยนใจ','ช่างฝึกหัด','คนมาดูเฉยๆ','ลูกค้าสักผิดที่','นักสะสมรอยสัก']},
  {name:'ร้านซักผ้าหยอดเหรียญ',e:'🧺',roles:['ลูกค้าประจำ','คนมาครั้งแรก','เจ้าของ','คนลืมผ้า','คนนั่งรอ','คนขโมยผ้า','ช่างซ่อมเครื่อง','คนพับผ้าเก่ง','คนเอาผ้าคนอื่นออก','นักศึกษา','คนหยอดเหรียญผิด','แม่บ้านมาเป็นประจำ']},
];

/* ══ SPYFALL FUNCTIONS ═══════════════════ */
let _spyInterval = null;

function initSpyfall(){
  if(_spyInterval){clearInterval(_spyInterval);_spyInterval=null;}
  S.spyDealt=false;S.spyFlipped=false;S._lastSpyData=null;
  if(!S.spyNumSpies)S.spyNumSpies=1;
  if(!S.spyTimeMins)S.spyTimeMins=8;
  const lbl=$('spyPhaseLabel');if(lbl)lbl.textContent='ตั้งค่าเกม';
  renderSpySetup();
}

function renderSpySetup(){
  const body=$('spyBody');if(!body)return;
  if(!S.isHost){
    body.innerHTML=`<div style="text-align:center;padding:4rem 1rem"><div style="font-size:60px;margin-bottom:1rem">⏳</div><div style="font-size:17px;font-weight:800;color:var(--t0);margin-bottom:0.5rem">รอ Host เริ่มเกม</div><div style="font-size:14px;color:var(--t2);line-height:1.7">เมื่อ Host เริ่มแล้ว<br>คุณจะเห็นบทบาทของคุณ</div></div>`;
    return;
  }
  const n=getPlayers().filter(p=>!p.isHost).length;
  body.innerHTML=`
    <div class="ww-score-bar" style="margin-bottom:1.25rem">
      <div>
        <div class="label" style="margin:0">ผู้เล่น (ไม่รวม Host)</div>
        <div style="font-size:28px;font-weight:900;color:var(--ac)">${n} คน</div>
      </div>
      <div style="text-align:right">
        <div class="label" style="margin:0">สถานที่</div>
        <div style="font-size:16px;font-weight:700;color:var(--t1)">${SPY_LOCATIONS.length} แห่ง</div>
      </div>
    </div>
    <div class="" style="padding:1rem 1.25rem;margin-bottom:1.25rem">
      <div class="label">จำนวนสายลับ</div>
      <div style="display:flex;align-items:center;gap:16px;margin-top:4px">
        <button class="ww-c-btn2" style="width:40px;height:40px;font-size:22px" onclick="S.spyNumSpies=Math.max(1,S.spyNumSpies-1);renderSpySetup()">−</button>
        <div style="font-size:34px;font-weight:900;color:var(--danger);flex:1;text-align:center">${S.spyNumSpies} 🕵️</div>
        <button class="ww-c-btn2" style="width:40px;height:40px;font-size:22px" onclick="S.spyNumSpies=Math.min(3,S.spyNumSpies+1);renderSpySetup()">+</button>
      </div>
    </div>
    <div class="" style="padding:1rem 1.25rem;margin-bottom:1.5rem">
      <div class="label">เวลาเกม</div>
      <div style="display:flex;align-items:center;gap:16px;margin-top:4px">
        <button class="ww-c-btn2" style="width:40px;height:40px;font-size:22px" onclick="S.spyTimeMins=Math.max(3,S.spyTimeMins-1);renderSpySetup()">−</button>
        <div style="font-size:34px;font-weight:900;color:var(--warn);flex:1;text-align:center">${S.spyTimeMins} นาที</div>
        <button class="ww-c-btn2" style="width:40px;height:40px;font-size:22px" onclick="S.spyTimeMins=Math.min(20,S.spyTimeMins+1);renderSpySetup()">+</button>
      </div>
    </div>
    <button class="btn btn-ac btn-next" onclick="startSpyfall()" style="height:56px;font-size:17px;font-weight:800" ${n<2?'disabled':''}>${n<2?'ต้องมีผู้เล่นอย่างน้อย 2 คน':'🕵️ เริ่มเกมสายลับกลางวง'}</button>`;
}

function startSpyfall(){
  const players=getPlayers().filter(p=>!p.isHost);
  if(players.length<2){showToast('ต้องมีผู้เล่นอย่างน้อย 2 คน');return;}
  const numSpies=Math.min(S.spyNumSpies,Math.floor(players.length/2));
  const locIdx=Math.floor(Math.random()*SPY_LOCATIONS.length);
  const loc=SPY_LOCATIONS[locIdx];
  const shuffled=shuffle([...players]);
  const spyIds=shuffled.slice(0,numSpies).map(p=>p.id);
  const roles=shuffle([...loc.roles]);
  const assigned={};let ri=0;
  shuffled.forEach(p=>{
    if(spyIds.includes(p.id))assigned[p.id]={isSpy:true,role:'สายลับ'};
    else{assigned[p.id]={isSpy:false,role:roles[ri%roles.length]};ri++;}
  });
  const dealId=Date.now();
  const data={locIdx,locName:loc.name,locEmoji:loc.e,spyIds,assigned,timeSecs:S.spyTimeMins*60,startedAt:dealId,dealt:true,dealId};
  S._lastSpyData=data;S._lastSpyDealId=dealId;S.spyDealt=true;S.spyFlipped=false;
  if(firebaseReady&&S.roomCode)db.ref(`rooms/${S.roomCode}/spy`).set(data);
  const lbl=$('spyPhaseLabel');if(lbl)lbl.textContent='ดำเนินเกม';
  if(S.isHost)renderSpyHost(data);
}

function syncSpyState(d){
  if(!d||!d.dealt)return;
  if(d.dealId&&d.dealId!==S._lastSpyDealId){S.spyFlipped=false;S._lastSpyDealId=d.dealId;}
  S.spyDealt=true;S._lastSpyData=d;
  const me=d.assigned&&d.assigned[myId()];
  if(me){S.spyRole=me.role;S.spyIsSpy=me.isSpy;}
  const onSpy=document.querySelector('.screen.active')?.id==='screen-spyfall';
  if(!onSpy)return;
  const lbl=$('spyPhaseLabel');if(lbl)lbl.textContent='ดำเนินเกม';
  if(S.isHost)renderSpyHost(d);else renderSpyPlayer(d);
}

function toggleSpyList(){S.spyListHidden=!S.spyListHidden;if(S._lastSpyData)renderSpyHost(S._lastSpyData);}

function renderSpyHost(d){
  const body=$('spyBody');if(!body)return;
  if(_spyInterval){clearInterval(_spyInterval);_spyInterval=null;}
  const loc=SPY_LOCATIONS[d.locIdx];
  const players=getPlayers().filter(p=>d.assigned&&d.assigned[p.id]);
  const elapsed=Math.floor((Date.now()-d.startedAt)/1000);
  let left=Math.max(0,(d.timeSecs||480)-elapsed);
  const spyHidden=!!S.spyListHidden;
  body.innerHTML=`
    <div class="" style="padding:14px 18px;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div class="label" style="margin:0">เวลาที่เหลือ</div>
        <div class="spy-timer${left<60?' urgent':''}" id="spyTimerH">${fmtTime(left)}</div>
      </div>
      <div style="text-align:right">
        <div class="label" style="margin:0">สถานที่</div>
        <div style="font-size:19px;font-weight:800;color:var(--t0)">${loc.e} ${loc.name}</div>
      </div>
    </div>
    <div style="background:rgba(255,92,92,0.08);border:1px solid rgba(255,92,92,0.2);border-radius:var(--r-s);padding:12px 16px;margin-bottom:1rem">
      <div class="label" style="color:var(--danger);margin-bottom:6px">🕵️ สายลับ</div>
      ${d.spyIds.map(id=>`<div style="font-size:17px;font-weight:800;color:var(--t0)">${esc(playerName_(id))}</div>`).join('')}
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div class="label" style="margin:0">ผู้เล่นทั้งหมด</div>
      <button class="btn btn-sf" style="height:32px;padding:0 12px;font-size:12px;font-weight:700" onclick="toggleSpyList()">${spyHidden?'👁 แสดงรายชื่อ':'🙈 ซ่อนรายชื่อ'}</button>
    </div>
    ${spyHidden
      ? `<div style="background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:1.25rem;text-align:center;margin-bottom:1rem">
          <div style="font-size:28px;margin-bottom:4px">🙈</div>
          <div style="font-size:14px;color:var(--t2)">รายชื่อถูกซ่อนอยู่</div>
        </div>`
      : `<div class="" style="margin-bottom:1rem">
          ${players.map((p,i)=>{
            const a=d.assigned[p.id];const isSpy=a&&a.isSpy;
            return `<div class="spy-host-row" style="${isSpy?'background:rgba(255,92,92,0.06)':''}">
              <div class="p-avatar" style="width:36px;height:36px;font-size:13px;font-weight:900;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${COLORS[i%COLORS.length]}28;color:${COLORS[i%COLORS.length]}">${esc(p.name.charAt(0).toUpperCase())}</div>
              <div style="flex:1">
                <div style="font-size:16px;font-weight:700;color:var(--t0)">${esc(p.name)}</div>
                <div style="font-size:13px;font-weight:600;color:${isSpy?'var(--danger)':'var(--ac)'}">${isSpy?'🕵️ สายลับ':'👤 '+esc(a?a.role:'')}</div>
              </div>
            </div>`;
          }).join('')}
        </div>`
    }
    <button class="btn btn-sf btn-next" style="margin-bottom:8px" onclick="resetSpyfall()">${REFRESH_SVG} เล่นรอบใหม่</button>`;
  _spyInterval=setInterval(()=>{
    left=Math.max(0,left-1);
    const el=$('spyTimerH');
    if(el){el.textContent=fmtTime(left);el.className='spy-timer'+(left<60?' urgent':'');}
    if(left<=0){clearInterval(_spyInterval);_spyInterval=null;showToast('⏰ หมดเวลา!',4000);}
  },1000);
}

function renderSpyPlayer(d){
  const body=$('spyBody');if(!body)return;
  if(_spyInterval){clearInterval(_spyInterval);_spyInterval=null;}
  const me=d.assigned&&d.assigned[myId()];
  const isSpy=me&&me.isSpy;
  const loc=SPY_LOCATIONS[d.locIdx];
  const flipped=S.spyFlipped;
  const elapsed=Math.floor((Date.now()-d.startedAt)/1000);
  let left=Math.max(0,(d.timeSecs||480)-elapsed);
  body.innerHTML=`
    <div class="" style="padding:12px 18px;margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:14px;color:var(--t2);font-weight:600">เวลาที่เหลือ</span>
      <span class="spy-timer${left<60?' urgent':''}" id="spyTimerP" style="font-size:26px">${fmtTime(left)}</span>
    </div>
    <div class="spy-card-wrap" onclick="toggleSpyCard()">
      ${!flipped
        ?`<div class="spy-card-front">
            <div style="font-size:52px;opacity:0.5">${isSpy?'🕵️':'🔒'}</div>
            <div style="font-size:16px;color:rgba(255,255,255,0.45);margin-top:4px">กดเพื่อดูบทบาท</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.2);margin-top:4px">⚠️ ห้ามให้คนอื่นเห็น</div>
          </div>`
        :isSpy
        ?`<div class="spy-card-back-spy">
            <div style="font-size:56px;margin-bottom:10px">🕵️</div>
            <div style="font-size:26px;font-weight:900;color:var(--danger);margin-bottom:10px">คุณคือสายลับ!</div>
            <div style="font-size:14px;color:rgba(255,130,130,0.65);line-height:1.7">ไม่รู้สถานที่ ฟังเบาะแส<br>เดาสถานที่ให้ถูก<br>อย่าให้ใครสงสัย!</div>
          </div>`
        :`<div class="spy-card-back">
            <div style="font-size:56px;margin-bottom:8px">${loc.e}</div>
            <div style="font-size:24px;font-weight:900;color:var(--t0);margin-bottom:6px">${esc(loc.name)}</div>
            <div style="font-size:12px;color:var(--t2);text-transform:uppercase;letter-spacing:0.08em;font-weight:700;margin-bottom:4px">บทบาทของคุณ</div>
            <div style="font-size:20px;font-weight:900;color:var(--ac)">${esc(me?me.role:'')}</div>
          </div>`
      }
    </div>
    <div style="background:rgba(255,133,0,0.07);border:1px solid rgba(255,133,0,0.15);border-radius:var(--r-s);padding:12px 16px;margin-top:1.25rem;font-size:14px;color:var(--ac);text-align:center;line-height:1.65">
      💡 ถามตอบกันในวง แล้วโหวตว่าใครคือสายลับ<br>
      <span style="color:var(--t2);font-size:13px">${SPY_LOCATIONS.length} สถานที่ที่เป็นไปได้ — รู้จากการถามตอบเอง</span>
    </div>`;
  _spyInterval=setInterval(()=>{
    left=Math.max(0,left-1);
    const el=$('spyTimerP');
    if(el){el.textContent=fmtTime(left);el.className='spy-timer'+(left<60?' urgent':'');}
    if(left<=0){clearInterval(_spyInterval);_spyInterval=null;showToast('⏰ หมดเวลา!',4000);}
  },1000);
}

function toggleSpyCard(){
  S.spyFlipped=!S.spyFlipped;
  if(S._lastSpyData)syncSpyState(S._lastSpyData);
}

function resetSpyfall(){
  if(_spyInterval){clearInterval(_spyInterval);_spyInterval=null;}
  S.spyDealt=false;S.spyFlipped=false;S._lastSpyData=null;S.spyListHidden=false;
  // set null → Firebase listener fires on all clients → shows setup screen
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/spy`).set(null);
  }
  const lbl=$('spyPhaseLabel');if(lbl)lbl.textContent='ตั้งค่าเกม';
  renderSpySetup();
}

function fmtTime(s){
  const m=Math.floor(s/60),sec=s%60;
  return m+':'+(sec<10?'0':'')+sec;
}



