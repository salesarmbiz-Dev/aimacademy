-- Create assessment_questions table
CREATE TABLE public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'ordering', 'matching')),
  question_text TEXT NOT NULL,
  question_text_th TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  explanation_th TEXT,
  points INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_attempts table
CREATE TABLE public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('pre_test', 'post_test')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  max_score INTEGER NOT NULL,
  percentage DECIMAL(5,2) DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  skill_scores JSONB DEFAULT '{}',
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_answers table
CREATE TABLE public.assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id),
  user_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activity_log table
CREATE TABLE public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_activity_user ON public.user_activity_log(user_id);
CREATE INDEX idx_activity_date ON public.user_activity_log(created_at);
CREATE INDEX idx_activity_type ON public.user_activity_log(activity_type);
CREATE INDEX idx_attempts_user ON public.assessment_attempts(user_id);
CREATE INDEX idx_attempts_type ON public.assessment_attempts(assessment_type);
CREATE INDEX idx_answers_attempt ON public.assessment_answers(attempt_id);
CREATE INDEX idx_questions_skill ON public.assessment_questions(skill_category);
CREATE INDEX idx_questions_active ON public.assessment_questions(is_active);

-- Enable RLS on all tables
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_questions (public read, admin write)
CREATE POLICY "Anyone can view active questions"
ON public.assessment_questions
FOR SELECT
USING (is_active = true);

-- RLS Policies for assessment_attempts (user owns their attempts)
CREATE POLICY "Users can view their own attempts"
ON public.assessment_attempts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attempts"
ON public.assessment_attempts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts"
ON public.assessment_attempts
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for assessment_answers (user owns via attempt)
CREATE POLICY "Users can view their own answers"
ON public.assessment_answers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.assessment_attempts
    WHERE id = attempt_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own answers"
ON public.assessment_answers
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.assessment_attempts
    WHERE id = attempt_id AND user_id = auth.uid()
  )
);

-- RLS Policies for user_activity_log (user owns their logs)
CREATE POLICY "Users can view their own activity"
ON public.user_activity_log
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can log their own activity"
ON public.user_activity_log
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Insert 20 mock assessment questions
INSERT INTO public.assessment_questions (skill_category, difficulty, question_type, question_text, question_text_th, options, correct_answer, explanation, explanation_th, points) VALUES
-- PROMPT STRUCTURE (4 questions)
('prompt_structure', 'beginner', 'multiple_choice', 
 'What are the main components of a good prompt?',
 'Prompt ที่ดีควรมีองค์ประกอบหลักอะไรบ้าง?',
 '[{"id":"a","text":"Just a short command","text_th":"แค่คำสั่งสั้นๆ"},{"id":"b","text":"Role + Context + Instruction + Output Format","text_th":"บทบาท+บริบท+คำสั่ง+รูปแบบผลลัพธ์"},{"id":"c","text":"Long detailed command","text_th":"คำสั่งยาวๆ ให้ครบถ้วน"},{"id":"d","text":"Add emotions for AI to understand","text_th":"ใส่อารมณ์ให้ AI เข้าใจ"}]',
 'b', 'A complete prompt includes role, context, instruction, and output format.', 'Prompt ที่สมบูรณ์ประกอบด้วย บทบาท บริบท คำสั่ง และรูปแบบผลลัพธ์', 10),

('prompt_structure', 'beginner', 'multiple_choice',
 'Which prompt has the best structure?',
 'ข้อใดเป็น Prompt ที่มีโครงสร้างดีที่สุด?',
 '[{"id":"a","text":"Help me write an email","text_th":"ช่วยเขียนอีเมล"},{"id":"b","text":"Write an email please, thanks","text_th":"เขียนอีเมลให้หน่อย ขอบคุณ"},{"id":"c","text":"You are a communication expert. Write an apology email to a customer about delayed delivery. Professional tone, 3 paragraphs.","text_th":"คุณเป็นผู้เชี่ยวชาญด้านการสื่อสาร เขียนอีเมลถึงลูกค้า เรื่องขอโทษสินค้าส่งล่าช้า น้ำเสียงสุภาพ ความยาว 3 ย่อหน้า"},{"id":"d","text":"Write a good email for me","text_th":"เขียนอีเมลดีๆ ให้ที"}]',
 'c', 'Option C includes role, context, specific task, tone, and format.', 'ตัวเลือก C มีครบทั้งบทบาท บริบท งานที่ต้องการ โทน และรูปแบบ', 10),

('prompt_structure', 'intermediate', 'multiple_choice',
 'Where should you place the instruction in a prompt for best results?',
 'การวาง Instruction ไว้ตำแหน่งใดใน Prompt ทำให้ AI ตอบตรงประเด็นที่สุด?',
 '[{"id":"a","text":"Always at the beginning","text_th":"ต้นของ Prompt เสมอ"},{"id":"b","text":"Always at the end","text_th":"ท้ายของ Prompt เสมอ"},{"id":"c","text":"In the middle","text_th":"ตรงกลาง"},{"id":"d","text":"Depends on the model, but beginning+end is usually best","text_th":"ขึ้นอยู่กับ model แต่ส่วนใหญ่ต้น+ท้ายดีที่สุด"}]',
 'd', 'Different models process prompts differently. Placing key instructions at the beginning and end ensures they receive attention.', 'แต่ละ model ประมวลผล Prompt ต่างกัน การวางคำสั่งสำคัญที่ต้นและท้ายช่วยให้ได้รับความสนใจ', 10),

('prompt_structure', 'advanced', 'multiple_choice',
 'How do System Prompt and User Prompt differ?',
 'System Prompt vs User Prompt ต่างกันอย่างไร?',
 '[{"id":"a","text":"No difference","text_th":"ไม่ต่างกัน"},{"id":"b","text":"System sets overall behavior, User gives specific commands","text_th":"System กำหนดพฤติกรรมภาพรวม User กำหนดคำสั่งเฉพาะ"},{"id":"c","text":"System is for admin, User is for customers","text_th":"System สำหรับ admin User สำหรับลูกค้า"},{"id":"d","text":"System is faster than User","text_th":"System เร็วกว่า User"}]',
 'b', 'System prompts define the AI personality and constraints, while user prompts contain the specific request.', 'System prompt กำหนดบุคลิกและข้อจำกัดของ AI ในขณะที่ User prompt มีคำขอเฉพาะ', 10),

-- CONTEXT SETTING (3 questions)
('context_setting', 'beginner', 'multiple_choice',
 'Why is providing context important in prompts?',
 'ทำไมการให้บริบท (Context) ถึงสำคัญใน Prompt?',
 '[{"id":"a","text":"Makes the prompt longer so AI responds better","text_th":"ทำให้ Prompt ยาวขึ้น AI จะตอบดีกว่า"},{"id":"b","text":"Helps AI understand scope and respond accurately","text_th":"ช่วยให้ AI เข้าใจขอบเขตและตอบตรงความต้องการ"},{"id":"c","text":"It is polite to explain to AI","text_th":"เป็นมารยาทในการคุยกับ AI"},{"id":"d","text":"Not important, direct commands are enough","text_th":"ไม่สำคัญ แค่สั่งตรงๆ ก็พอ"}]',
 'b', 'Context helps AI understand the boundaries and deliver targeted responses.', 'บริบทช่วยให้ AI เข้าใจขอบเขตและส่งมอบคำตอบที่ตรงจุด', 10),

('context_setting', 'beginner', 'multiple_choice',
 'Compare: "Write an ad" vs "Write a Facebook ad for a coffee shop, targeting working professionals, budget 500 baht"',
 'Prompt "เขียนโฆษณา" vs "เขียนโฆษณา Facebook สำหรับร้านกาแฟ กลุ่มเป้าหมายวัยทำงาน งบ 500 บาท" ข้อใดถูก?',
 '[{"id":"a","text":"First is better, gives AI freedom","text_th":"อันแรกดีกว่า เพราะให้อิสระ AI"},{"id":"b","text":"Second is better, clear context leads to targeted response","text_th":"อันหลังดีกว่า เพราะบริบทชัดเจน AI ตอบตรงจุด"},{"id":"c","text":"Same result","text_th":"เหมือนกัน"},{"id":"d","text":"First is better, shorter means faster processing","text_th":"อันแรกดีกว่า เพราะสั้น AI ประมวลผลเร็วกว่า"}]',
 'b', 'Specific context helps AI produce more relevant and useful output.', 'บริบทที่เฉพาะเจาะจงช่วยให้ AI สร้างผลลัพธ์ที่เกี่ยวข้องและมีประโยชน์มากขึ้น', 10),

('context_setting', 'intermediate', 'multiple_choice',
 'What is Few-shot Prompting?',
 'Few-shot Prompting คืออะไร?',
 '[{"id":"a","text":"Asking AI briefly","text_th":"การถาม AI สั้นๆ"},{"id":"b","text":"Sending multiple prompts in succession","text_th":"การยิง Prompt หลายครั้งติดๆ"},{"id":"c","text":"Providing 2-3 input-output examples so AI learns the pattern","text_th":"การให้ตัวอย่าง input-output 2-3 ตัวอย่าง เพื่อให้ AI เข้าใจ pattern"},{"id":"d","text":"Limiting AI to short responses","text_th":"การจำกัดให้ AI ตอบสั้น"}]',
 'c', 'Few-shot prompting uses examples to demonstrate the desired pattern to the AI.', 'Few-shot prompting ใช้ตัวอย่างเพื่อแสดง pattern ที่ต้องการให้ AI', 10),

-- OUTPUT CONTROL (3 questions)
('output_control', 'beginner', 'multiple_choice',
 'What is the best way to get AI to respond in a specific format?',
 'วิธีใดทำให้ AI ตอบในรูปแบบที่ต้องการได้ดีที่สุด?',
 '[{"id":"a","text":"Ask it to respond well","text_th":"ขอให้ตอบดีๆ"},{"id":"b","text":"Specify format clearly, e.g., respond in a table with 3 columns","text_th":"ระบุรูปแบบชัดเจน เช่น ตอบเป็นตาราง 3 คอลัมน์"},{"id":"c","text":"Keep sending prompts until you get it","text_th":"ส่ง Prompt ซ้ำจนกว่าจะได้"},{"id":"d","text":"Use English only","text_th":"ใช้ภาษาอังกฤษเท่านั้น"}]',
 'b', 'Explicitly specifying the desired format gives AI clear guidance.', 'การระบุรูปแบบที่ต้องการอย่างชัดเจนให้แนวทางที่ชัดเจนแก่ AI', 10),

('output_control', 'intermediate', 'multiple_choice',
 'How should you get AI to respond in JSON format?',
 'ถ้าต้องการให้ AI ตอบเป็น JSON format ควรทำอย่างไร?',
 '[{"id":"a","text":"Just say respond in JSON","text_th":"บอกว่า ตอบเป็น JSON"},{"id":"b","text":"Provide the JSON structure example you want","text_th":"ให้ตัวอย่าง JSON structure ที่ต้องการ"},{"id":"c","text":"Both A and B","text_th":"ทั้ง a และ b"},{"id":"d","text":"AI cannot respond in JSON","text_th":"AI ไม่สามารถตอบเป็น JSON ได้"}]',
 'c', 'Combining instruction with example structure gives the best JSON output.', 'การรวมคำสั่งกับตัวอย่างโครงสร้างให้ผลลัพธ์ JSON ที่ดีที่สุด', 10),

('output_control', 'advanced', 'multiple_choice',
 'What does Temperature in AI models affect?',
 'Temperature ใน AI model มีผลอย่างไร?',
 '[{"id":"a","text":"Response speed","text_th":"ความเร็วในการตอบ"},{"id":"b","text":"Response length","text_th":"ความยาวของคำตอบ"},{"id":"c","text":"Creativity vs accuracy - higher means more creative, lower means more accurate","text_th":"ความคิดสร้างสรรค์ vs ความแม่นยำ (ยิ่งสูง ยิ่งสร้างสรรค์ ยิ่งต่ำ ยิ่งแม่นยำ)"},{"id":"d","text":"Response language","text_th":"ภาษาที่ใช้ตอบ"}]',
 'c', 'Temperature controls randomness - low for factual tasks, high for creative tasks.', 'Temperature ควบคุมความสุ่ม - ต่ำสำหรับงานข้อเท็จจริง สูงสำหรับงานสร้างสรรค์', 10),

-- ROLE ASSIGNMENT (3 questions)
('role_assignment', 'beginner', 'multiple_choice',
 'What is the benefit of Role Prompting?',
 'การกำหนดบทบาทให้ AI (Role Prompting) มีประโยชน์อย่างไร?',
 '[{"id":"a","text":"No benefit, direct commands are better","text_th":"ไม่มีประโยชน์ แค่สั่งตรงๆ ดีกว่า"},{"id":"b","text":"Helps AI adjust tone, knowledge, and perspective according to the role","text_th":"ช่วยให้ AI ปรับโทน ความรู้ และมุมมองตามบทบาท"},{"id":"c","text":"Makes AI smarter","text_th":"ทำให้ AI ฉลาดขึ้น"},{"id":"d","text":"Makes AI respond faster","text_th":"ทำให้ AI ตอบเร็วขึ้น"}]',
 'b', 'Role prompting helps AI adopt appropriate expertise and communication style.', 'Role prompting ช่วยให้ AI รับบทบาทความเชี่ยวชาญและรูปแบบการสื่อสารที่เหมาะสม', 10),

('role_assignment', 'intermediate', 'multiple_choice',
 'Which is better: "You are a marketer with 10 years experience" vs "You are an expert"?',
 'Prompt "คุณเป็นนักการตลาดที่มีประสบการณ์ 10 ปี" vs "คุณเป็นผู้เชี่ยวชาญ" อันไหนดีกว่า?',
 '[{"id":"a","text":"Second one, broader scope","text_th":"อันหลัง เพราะกว้างกว่า"},{"id":"b","text":"First one, more specific so AI adapts better","text_th":"อันแรก เพราะเฉพาะเจาะจงกว่า AI จะปรับตัวได้ดีกว่า"},{"id":"c","text":"Same result","text_th":"เหมือนกัน"},{"id":"d","text":"Should not assign roles","text_th":"ไม่ควรกำหนดบทบาท"}]',
 'b', 'Specific roles with details help AI produce more targeted responses.', 'บทบาทที่เฉพาะเจาะจงพร้อมรายละเอียดช่วยให้ AI สร้างคำตอบที่ตรงเป้ามากขึ้น', 10),

('role_assignment', 'advanced', 'multiple_choice',
 'What is Multi-persona Prompting?',
 'Multi-persona Prompting คืออะไร?',
 '[{"id":"a","text":"Having AI take on multiple roles simultaneously, like 3 experts debating","text_th":"ให้ AI สวมบทบาทหลายคนพร้อมกัน เช่น ผู้เชี่ยวชาญ 3 คนถกเถียงกัน"},{"id":"b","text":"Sending prompts to multiple AIs","text_th":"ส่ง Prompt ให้ AI หลายตัว"},{"id":"c","text":"Asking AI repeatedly","text_th":"ถาม AI ซ้ำหลายครั้ง"},{"id":"d","text":"Having AI respond in multiple languages","text_th":"ให้ AI ตอบหลายภาษา"}]',
 'a', 'Multi-persona prompting uses multiple perspectives within one prompt for richer analysis.', 'Multi-persona prompting ใช้หลายมุมมองในหนึ่ง prompt เพื่อการวิเคราะห์ที่หลากหลายขึ้น', 10),

-- CHAIN PROMPTING (3 questions)
('chain_prompting', 'intermediate', 'multiple_choice',
 'What type of work is Chain Prompting suitable for?',
 'Chain Prompting (การเชื่อมต่อ Prompt) เหมาะกับงานแบบไหน?',
 '[{"id":"a","text":"Simple tasks needing short answers","text_th":"งานง่ายๆ ที่ต้องการคำตอบสั้น"},{"id":"b","text":"Complex tasks that need to be broken into steps","text_th":"งานซับซ้อนที่ต้องแบ่งเป็นขั้นตอน"},{"id":"c","text":"Tasks requiring speed","text_th":"งานที่ต้องการความเร็ว"},{"id":"d","text":"All tasks, should always use it","text_th":"ทุกงาน ควรใช้เสมอ"}]',
 'b', 'Chain prompting breaks complex tasks into manageable sequential steps.', 'Chain prompting แบ่งงานซับซ้อนเป็นขั้นตอนต่อเนื่องที่จัดการได้', 10),

('chain_prompting', 'intermediate', 'multiple_choice',
 'Which is a good Chain Prompting example?',
 'ข้อใดเป็นตัวอย่าง Chain Prompting ที่ดี?',
 '[{"id":"a","text":"Ask everything in one prompt","text_th":"ถามทุกอย่างใน Prompt เดียว"},{"id":"b","text":"Step 1: Analyze problem → Step 2: Find options → Step 3: Evaluate options → Step 4: Summarize","text_th":"Step 1: วิเคราะห์ปัญหา → Step 2: หาทางเลือก → Step 3: ประเมินทางเลือก → Step 4: สรุป"},{"id":"c","text":"Keep asking until you get the desired answer","text_th":"ถามซ้ำจนกว่าจะได้คำตอบที่ต้องการ"},{"id":"d","text":"Use many short prompts","text_th":"ใช้ Prompt สั้นๆ หลายๆ ครั้ง"}]',
 'b', 'Good chain prompting has clear logical progression between steps.', 'Chain prompting ที่ดีมีความก้าวหน้าทางตรรกะที่ชัดเจนระหว่างขั้นตอน', 10),

('chain_prompting', 'advanced', 'multiple_choice',
 'How do Prompt Chaining and Mega Prompt differ?',
 'Prompt Chaining กับ Mega Prompt ต่างกันอย่างไร?',
 '[{"id":"a","text":"No difference","text_th":"ไม่ต่างกัน"},{"id":"b","text":"Chaining splits into multiple sequential prompts / Mega Prompt combines everything in one","text_th":"Chaining แบ่งเป็นหลาย Prompt ต่อเนื่อง / Mega Prompt รวมทุกอย่างใน Prompt เดียว"},{"id":"c","text":"Mega Prompt is always better","text_th":"Mega Prompt ดีกว่าเสมอ"},{"id":"d","text":"Chaining is always better","text_th":"Chaining ดีกว่าเสมอ"}]',
 'b', 'Chaining uses multiple steps with feedback loops, Mega Prompt is one comprehensive instruction.', 'Chaining ใช้หลายขั้นตอนพร้อม feedback loops ส่วน Mega Prompt เป็นคำสั่งครอบคลุมเดียว', 10),

-- ERROR DETECTION (4 questions)
('error_detection', 'beginner', 'multiple_choice',
 'What is wrong with this prompt: "Help me with work"?',
 'Prompt นี้มีปัญหาอะไร: "ช่วยทำงานให้หน่อย"',
 '[{"id":"a","text":"No problem","text_th":"ไม่มีปัญหา"},{"id":"b","text":"Does not specify what work, no context, no output format","text_th":"ไม่ระบุว่างานอะไร ไม่มีบริบท ไม่มีรูปแบบผลลัพธ์"},{"id":"c","text":"Too short, just make it longer","text_th":"สั้นเกินไป แค่ยาวขึ้นก็พอ"},{"id":"d","text":"Not polite","text_th":"ไม่สุภาพ"}]',
 'b', 'The prompt lacks specificity, context, and output format requirements.', 'Prompt ขาดความเฉพาะเจาะจง บริบท และข้อกำหนดรูปแบบผลลัพธ์', 10),

('error_detection', 'intermediate', 'multiple_choice',
 'What is the main cause of AI giving wrong answers or hallucinating?',
 'AI ตอบผิดหรือ Hallucinate สาเหตุหลักคืออะไร?',
 '[{"id":"a","text":"AI is dumb","text_th":"AI โง่"},{"id":"b","text":"Server problems","text_th":"Server มีปัญหา"},{"id":"c","text":"Unclear prompt, lacking context, or asking about things AI has no data on","text_th":"Prompt ไม่ชัดเจน ขาดบริบท หรือถามเรื่องที่ AI ไม่มีข้อมูล"},{"id":"d","text":"Must pay to get correct answers","text_th":"ต้องจ่ายเงินถึงจะตอบถูก"}]',
 'c', 'Hallucinations often occur when prompts are vague or ask about topics beyond AI training data.', 'Hallucination มักเกิดเมื่อ prompt คลุมเครือหรือถามเรื่องนอกเหนือข้อมูลที่ AI ถูกฝึก', 10),

('error_detection', 'advanced', 'multiple_choice',
 'What is the best way to reduce hallucination?',
 'วิธีลด Hallucination ที่ดีที่สุดคืออะไร?',
 '[{"id":"a","text":"Ask AI repeatedly","text_th":"ถาม AI ซ้ำหลายๆ ครั้ง"},{"id":"b","text":"Tell AI to say I dont know if unsure + ask for sources + limit scope","text_th":"บอกให้ AI ตอบว่า ไม่รู้ ถ้าไม่แน่ใจ + ให้อ้างอิงแหล่งข้อมูล + จำกัดขอบเขต"},{"id":"c","text":"Use more expensive AI","text_th":"ใช้ AI ตัวที่แพงกว่า"},{"id":"d","text":"Write prompts in English","text_th":"เขียน Prompt เป็นภาษาอังกฤษ"}]',
 'b', 'Combining uncertainty acknowledgment, source citing, and scope limitation effectively reduces hallucinations.', 'การรวมการยอมรับความไม่แน่นอน การอ้างอิงแหล่งที่มา และการจำกัดขอบเขตช่วยลด hallucination ได้อย่างมีประสิทธิภาพ', 10),

('error_detection', 'advanced', 'multiple_choice',
 'What is Prompt Injection?',
 'Prompt Injection คืออะไร?',
 '[{"id":"a","text":"Sending multiple prompts at once","text_th":"การใส่ Prompt หลายอันพร้อมกัน"},{"id":"b","text":"Injecting commands to trick AI into doing unintended actions","text_th":"การฉีดคำสั่งเข้าไปเพื่อหลอกให้ AI ทำตามคำสั่งที่ไม่ได้ตั้งใจ"},{"id":"c","text":"Putting code in prompt","text_th":"การใส่โค้ดใน Prompt"},{"id":"d","text":"Using prompts that are too long","text_th":"การใช้ Prompt ยาวเกินไป"}]',
 'b', 'Prompt injection is a security vulnerability where malicious instructions override intended behavior.', 'Prompt injection เป็นช่องโหว่ด้านความปลอดภัยที่คำสั่งอันตรายแทนที่พฤติกรรมที่ตั้งใจ', 10);