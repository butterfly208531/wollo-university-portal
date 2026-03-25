<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Policy;
use App\Models\SystemSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admins
        $admin = Admin::create([
            'name'     => 'Admin User',
            'email'    => 'admin@wu.edu.et',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
        ]);

        // Categories
        $cats = [
            ['slug' => 'admission',    'name_en' => 'Student Admission',  'name_am' => 'የተማሪ ምዝገባ',          'order' => 1],
            ['slug' => 'registration', 'name_en' => 'Registration',       'name_am' => 'ምዝገባ',               'order' => 2],
            ['slug' => 'academic',     'name_en' => 'Academic Rules',     'name_am' => 'የአካዳሚክ ደንቦች',       'order' => 3],
            ['slug' => 'grading',      'name_en' => 'Grading System',     'name_am' => 'የደረጃ አሰጣጥ ስርዓት',   'order' => 4],
            ['slug' => 'graduation',   'name_en' => 'Graduation',         'name_am' => 'ምረቃ',               'order' => 5],
            ['slug' => 'conduct',      'name_en' => 'Student Conduct',    'name_am' => 'የተማሪ ሥነ-ምግባር',     'order' => 6],
            ['slug' => 'fees',         'name_en' => 'Tuition & Fees',     'name_am' => 'ትምህርት ክፍያ',        'order' => 7],
            ['slug' => 'transfer',     'name_en' => 'Transfer Policies',  'name_am' => 'የዝውውር ፖሊሲዎች',     'order' => 8],
        ];

        $categoryMap = [];
        foreach ($cats as $cat) {
            $categoryMap[$cat['slug']] = Category::create($cat);
        }

        // Policies
        $policies = [
            [
                'category' => 'academic',
                'title_en' => 'Introduction – Mission, Vision & Values',
                'title_am' => 'መግቢያ – ተልዕኮ፣ ራዕይ እና እሴቶች',
                'page_number' => 1,
                'tags' => ['mission', 'vision', 'values'],
                'content_en' => '<h2>Mission</h2><p>To serve as a model for other educational institutions within the country by Producing internationally competent Engineering and Technology graduates, conducting technology-based applied research, and transferring technologies for industries and communities through strong partnership and entrepreneurship culture.</p><h2>Values</h2><ol><li><strong>Innovation:</strong> The DDIT accommodates new ideas with open mind to benefit from them.</li><li><strong>Professionalism:</strong> The DDIT operates with the highest possible standards of professionalism, personal fulfillment, ethics and pursuit.</li><li><strong>Team spirit:</strong> The DDIT staff, students and community work together to realize our mission and vision.</li><li><strong>Emphasis to Quality:</strong> The DDIT believes that it can realize its vision through the highest of excellence in education, research, technology transfer, community service and good governance.</li><li><strong>Continual learning:</strong> The DDIT will continually learn from both its successes and failures.</li><li><strong>Partnership:</strong> The DDIT believes that its success or failure depends on its partner\'s success or failure.</li><li><strong>Academic Freedom and Autonomy:</strong> The DDIT makes use of its academic freedom and institutional autonomy in order to improve its services.</li><li><strong>Social Responsibility:</strong> The DDIT commits compassion, generosity and concern for the needs and aspirations of others.</li></ol>',
                'content_am' => '<h2>ተልዕኮ</h2><p>በሀገሪቱ ውስጥ ለሌሎች የትምህርት ተቋማት ሞዴል ለመሆን፣ ዓለም አቀፍ ብቃት ያላቸው ምሩቃን ማፍራት።</p>',
            ],
            [
                'category' => 'academic',
                'title_en' => 'Academic Calendar',
                'title_am' => 'የአካዳሚክ ቀን መቁጠሪያ',
                'page_number' => 3,
                'tags' => ['calendar', 'semester', 'schedule'],
                'content_en' => '<h2>Academic Calendar</h2><p>The academic year at Wollo University is divided into two semesters:</p><ul><li><strong>First Semester:</strong> September – January</li><li><strong>Second Semester:</strong> February – June</li></ul><h3>Key Dates</h3><ul><li>Registration: First two weeks of each semester</li><li>Add/Drop Period: First two weeks after registration</li><li>Mid-semester exams: Week 8</li><li>Final exams: Weeks 15–16</li></ul>',
                'content_am' => '<h2>የአካዳሚክ ቀን መቁጠሪያ</h2><p>የትምህርት ዓመት በሁለት ሴሚስተሮች ይከፈላል።</p>',
            ],
            [
                'category' => 'admission',
                'title_en' => 'Student Admission Requirements',
                'title_am' => 'የተማሪ ምዝገባ መስፈርቶች',
                'page_number' => 5,
                'tags' => ['admission', 'requirements', 'CEP'],
                'content_en' => '<h2>Full-Time Regular Program</h2><p>Admission is based on the Ethiopian University Entrance Examination (EUEE) results and placement by the Ministry of Education.</p><h3>Requirements</h3><ul><li>Completion of Ethiopian Grade 12</li><li>Passing score on EUEE</li><li>Meeting department-specific cut-off points</li></ul><h2>Continuing Education Program (CEP)</h2><p>Designed for working professionals.</p><h2>Affirmative Action</h2><p>Wollo University implements affirmative action policies for women, students from disadvantaged regions, and students with disabilities.</p>',
                'content_am' => '<h2>ምዝገባ</h2><p>በ EUEE ውጤቶች ላይ የተመሰረተ ነው።</p>',
            ],
            [
                'category' => 'registration',
                'title_en' => 'Registration & Add/Drop Policy',
                'title_am' => 'ምዝገባ እና መጨመር/መቀነስ ፖሊሲ',
                'page_number' => 10,
                'tags' => ['registration', 'add', 'drop'],
                'content_en' => '<h2>Registration</h2><p>All students must register at the beginning of each semester within the designated registration period.</p><h3>Requirements</h3><ul><li>Clearance from the Finance Office</li><li>Academic advisor approval</li><li>Valid student ID</li></ul><h2>Add and Drop</h2><p>Students may add or drop courses during the first two weeks without academic penalty.</p><ul><li>Dropping after week 2: A "W" grade is recorded</li><li>Dropping after week 8: Requires Dean approval; "WF" may be recorded</li></ul>',
                'content_am' => '<h2>ምዝገባ</h2><p>በእያንዳንዱ ሴሚስተር መጀመሪያ ላይ ይመዝገቡ።</p>',
            ],
            [
                'category' => 'grading',
                'title_en' => 'Grading System & Academic Achievement',
                'title_am' => 'የደረጃ አሰጣጥ ስርዓት',
                'page_number' => 20,
                'tags' => ['grading', 'GPA', 'CGPA'],
                'content_en' => '<h2>Grading Scale</h2><table><thead><tr><th>Grade</th><th>Points</th><th>Percentage</th><th>Description</th></tr></thead><tbody><tr><td>A+/A</td><td>4.0</td><td>85-100%</td><td>Excellent</td></tr><tr><td>B+</td><td>3.5</td><td>75-79%</td><td>Good</td></tr><tr><td>B</td><td>3.0</td><td>70-74%</td><td>Above Average</td></tr><tr><td>C</td><td>2.0</td><td>50-59%</td><td>Satisfactory</td></tr><tr><td>F</td><td>0.0</td><td>0-39%</td><td>Failure</td></tr></tbody></table><h2>Academic Standing</h2><ul><li><strong>Good Standing:</strong> CGPA 2.0 and above</li><li><strong>Academic Warning:</strong> CGPA 1.75-1.99</li><li><strong>Dismissal:</strong> CGPA below 1.50 for two consecutive semesters</li></ul>',
                'content_am' => '<h2>ደረጃ</h2><p>A=4.0, B=3.0, C=2.0, F=0.0</p>',
            ],
            [
                'category' => 'graduation',
                'title_en' => 'Graduation Requirements',
                'title_am' => 'የምረቃ መስፈርቶች',
                'page_number' => 35,
                'tags' => ['graduation', 'degree', 'honor'],
                'content_en' => '<h2>Graduation Requirements</h2><ul><li>Complete all required credit hours</li><li>Achieve minimum CGPA of 2.0</li><li>Pass all required courses with minimum grade C</li><li>Clear all financial obligations</li></ul><h2>Honor Roll</h2><ul><li><strong>Summa Cum Laude:</strong> CGPA 3.75 and above</li><li><strong>Magna Cum Laude:</strong> CGPA 3.50-3.74</li><li><strong>Cum Laude:</strong> CGPA 3.25-3.49</li></ul>',
                'content_am' => '<h2>ምረቃ</h2><p>ዝቅተኛ CGPA 2.0 ያስፈልጋል።</p>',
            ],
            [
                'category' => 'academic',
                'title_en' => 'Class Attendance Policy',
                'title_am' => 'የክፍል ክትትል ፖሊሲ',
                'page_number' => 25,
                'tags' => ['attendance', 'absence'],
                'content_en' => '<h2>Attendance Requirements</h2><p>Regular class attendance is mandatory. Students must attend at least 85% of all scheduled classes.</p><ul><li>Absences exceeding 15%: Warning and grade deduction</li><li>Absences exceeding 25%: Automatic F grade</li></ul>',
                'content_am' => '<h2>ክትትል</h2><p>85% ክትትል ያስፈልጋል።</p>',
            ],
            [
                'category' => 'academic',
                'title_en' => 'Examination Rules & Make-up Exams',
                'title_am' => 'የፈተና ደንቦች',
                'page_number' => 28,
                'tags' => ['exam', 'makeup', 'assessment'],
                'content_en' => '<h2>Examination Rules</h2><ul><li>Present valid student ID to enter exam hall</li><li>No unauthorized electronic devices</li><li>Cheating results in automatic failure and disciplinary action</li></ul><h2>Make-up Examinations</h2><p>Granted only for: serious illness, death of immediate family, official university representation, or force majeure.</p><h2>Re-marking</h2><p>Apply within 5 working days of receiving results. A fee is charged.</p>',
                'content_am' => '<h2>ፈተና</h2><p>መታወቂያ ያስፈልጋል። ማጭበርበር አይፈቀድም።</p>',
            ],
            [
                'category' => 'fees',
                'title_en' => 'Tuition Fees & Financial Obligations',
                'title_am' => 'ትምህርት ክፍያ',
                'page_number' => 45,
                'tags' => ['fees', 'tuition', 'payment'],
                'content_en' => '<h2>Tuition and Fees</h2><ul><li><strong>Regular Program:</strong> Government-subsidized</li><li><strong>CEP Program:</strong> Full tuition fees apply</li></ul><h2>Payment</h2><p>Fees must be paid before or during registration. Unpaid fees result in registration hold.</p>',
                'content_am' => '<h2>ክፍያ</h2><p>መደበኛ ፕሮግራም በመንግስት ይደጎማል።</p>',
            ],
            [
                'category' => 'transfer',
                'title_en' => 'Transfer Policies',
                'title_am' => 'የዝውውር ፖሊሲዎች',
                'page_number' => 50,
                'tags' => ['transfer', 'credit'],
                'content_en' => '<h2>Transfer Eligibility</h2><ul><li>Minimum CGPA of 2.0 at previous institution</li><li>No pending disciplinary actions</li></ul><h2>Credit Transfer</h2><ul><li>Maximum 50% of program credits may be transferred</li><li>Transferred grades not included in CGPA calculation</li></ul>',
                'content_am' => '<h2>ዝውውር</h2><p>ዝቅተኛ CGPA 2.0 ያስፈልጋል።</p>',
            ],
            [
                'category' => 'conduct',
                'title_en' => 'Student Rights & Responsibilities',
                'title_am' => 'የተማሪ መብቶች እና ኃላፊነቶች',
                'page_number' => 8,
                'tags' => ['rights', 'responsibilities', 'ID'],
                'content_en' => '<h2>Student Rights</h2><ul><li>Right to quality education and fair assessment</li><li>Right to appeal academic decisions</li><li>Right to a safe and inclusive learning environment</li></ul><h2>Student Responsibilities</h2><ul><li>Attend classes regularly</li><li>Maintain academic integrity</li><li>Pay fees on time</li><li>Carry student ID at all times on campus</li></ul>',
                'content_am' => '<h2>መብቶች</h2><p>ጥራት ያለው ትምህርት የማግኘት መብት።</p>',
            ],
            [
                'category' => 'academic',
                'title_en' => 'Dismissal & Re-admission',
                'title_am' => 'ማስወጣት እና እንደገና መቀበል',
                'page_number' => 38,
                'tags' => ['dismissal', 'readmission', 'probation'],
                'content_en' => '<h2>Academic Dismissal</h2><p>A student may be dismissed if:</p><ul><li>CGPA falls below 1.50 for two consecutive semesters</li><li>Fails required courses after maximum allowed attempts</li></ul><h2>Re-admission</h2><p>Apply after minimum one academic year. Subject to available space and Academic Commission approval.</p>',
                'content_am' => '<h2>ማስወጣት</h2><p>CGPA ለሁለት ሴሚስተሮች ከ1.50 በታች ሲወድቅ።</p>',
            ],
        ];

        foreach ($policies as $p) {
            Policy::create([
                'title_en'    => $p['title_en'],
                'title_am'    => $p['title_am'],
                'content_en'  => $p['content_en'],
                'content_am'  => $p['content_am'],
                'category_id' => $categoryMap[$p['category']]->id,
                'page_number' => $p['page_number'],
                'version'     => '1.0',
                'tags'        => $p['tags'],
                'status'      => 'published',
                'created_by'  => $admin->id,
                'updated_by'  => $admin->id,
            ]);
        }

        // System settings
        $settings = [
            'site_title'       => 'Wollo University Academic Portal',
            'default_language' => 'en',
            'default_theme'    => 'light',
            'maintenance_mode' => 'false',
        ];
        foreach ($settings as $key => $value) {
            SystemSetting::create(['key' => $key, 'value' => $value]);
        }
    }
}
