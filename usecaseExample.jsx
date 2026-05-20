import { useState } from "react";
import {
    FormFieldMessage,
    TextField,
    EmailField,
    PhoneField,
    PasswordField,
    TextArea,
    NumberField,
    SelectField,
    SearchableSelect,
    DateField,
    TimeField,
    CalendarField,
    RadioGroup,
    CheckboxGroup,
    SwitchField,
    TagsField,
    UrlField,
    ImagePickerField,
    VideoPickerField,
    FilePickerField,
    SearchField,
} from "./formFields";

/* ─────────────────────────────────────────────────────────────────
   Mock async search — SearchField demo-তে ব্যবহার হবে
───────────────────────────────────────────────────────────────── */
const MOCK_USERS = [
    { id: 1, name: "Alice Rahman", email: "alice@example.com", description: "Frontend Engineer" },
    { id: 2, name: "Bob Hossain", email: "bob@example.com", description: "Product Manager" },
    { id: 3, name: "Carol Islam", email: "carol@example.com", description: "UI/UX Designer" },
    { id: 4, name: "David Chowdhury", email: "david@example.com", description: "Backend Engineer" },
    { id: 5, name: "Eva Sultana", email: "eva@example.com", description: "Data Analyst" },
];

/* ═══════════════════════════════════════════════════════════════
   1. FormFieldMessage
   — Error / helper message renderer. Standalone usage example.
═══════════════════════════════════════════════════════════════ */
export function FormFieldMessageExample() {
    return (
        <div>
            {/* Error state */}
            <FormFieldMessage
                hasError={true}
                error="This field is required."
                helperText="We'll never share your data."
            />

            {/* Helper state (hasError=false হলে helperText দেখায়) */}
            <FormFieldMessage
                hasError={false}
                error=""
                helperText="Enter your registered email address."
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   2. TextField
═══════════════════════════════════════════════════════════════ */
export function TextFieldExample() {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const validate = () => {
        setError(name.trim() === "" ? "Full name is required." : "");
    };

    return (
        <TextField
            label="Full Name"
            value={name}
            setValue={setName}
            onChange={(value, event) => console.log("onChange →", value)}
            placeholder="John Doe"
            type="text"
            name="fullName"
            id="txt-full-name"
            required={true}
            disabled={false}
            readOnly={false}
            maxLength={100}
            autoFocus={false}
            helperText="As it appears on your ID"
            error={error}
            showError={true}
            leftIcon={<span>👤</span>}
            rightIcon={null}
            onBlur={validate}
            onFocus={() => console.log("focused")}
            onKeyDown={(e) => e.key === "Enter" && validate()}
            className=""
            inputClassName=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   3. EmailField
═══════════════════════════════════════════════════════════════ */
export function EmailFieldExample() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    return (
        <EmailField
            label="Email Address"
            value={email}
            setValue={setEmail}
            onChange={(value, event) => console.log("email →", value)}
            placeholder="you@example.com"
            name="email"
            id="email-field"
            required={true}
            disabled={false}
            readOnly={false}
            autoFocus={false}
            helperText="We'll never share your email."
            error={error}
            showError={true}
            onBlur={() => {
                const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
                setError(valid ? "" : "Enter a valid email address.");
            }}
            onFocus={() => setError("")}
            onKeyDown={(e) => console.log("key →", e.key)}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   4. PhoneField
═══════════════════════════════════════════════════════════════ */
export function PhoneFieldExample() {
    const [phone, setPhone] = useState("+880 ");
    const [error, setError] = useState("");

    return (
        <PhoneField
            label="Phone Number"
            value={phone}
            setValue={setPhone}
            onChange={(value, event) => console.log("phone →", value)}
            placeholder="1712 345 678"
            defaultCountryCode="+880"
            name="phone"
            id="phone-field"
            required={true}
            disabled={false}
            readOnly={false}
            helperText="Include your area code"
            error={error}
            showError={true}
            onBlur={() => setError(phone.length < 8 ? "Enter a valid phone number." : "")}
            onFocus={() => setError("")}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   5. PasswordField
═══════════════════════════════════════════════════════════════ */
export function PasswordFieldExample() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <PasswordField
            label="Password"
            value={password}
            setValue={setPassword}
            onChange={(value, event) => console.log("password changed")}
            placeholder="Enter password"
            name="password"
            id="password-field"
            required={true}
            disabled={false}
            maxLength={128}
            autoFocus={false}
            helperText="Min 8 characters, include a number"
            error={error}
            showError={true}
            onBlur={() => setError(password.length < 8 ? "Password must be at least 8 characters." : "")}
            onFocus={() => setError("")}
            onKeyDown={(e) => console.log("key →", e.key)}
            className=""
            inputClassName=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   6. TextArea
═══════════════════════════════════════════════════════════════ */
export function TextAreaExample() {
    const [bio, setBio] = useState("");
    const [error, setError] = useState("");

    return (
        <TextArea
            label="Bio"
            value={bio}
            setValue={setBio}
            onChange={(value, event) => console.log("textarea →", value)}
            placeholder="Tell us about yourself..."
            rows={5}
            maxLength={500}
            minLength={20}
            name="bio"
            id="bio-field"
            required={false}
            disabled={false}
            readOnly={false}
            autoFocus={false}
            helperText="Keep it concise and friendly."
            error={error}
            showError={true}
            onBlur={() => setError(bio.length > 0 && bio.length < 20 ? "Bio must be at least 20 characters." : "")}
            onFocus={() => setError("")}
            onKeyDown={(e) => console.log("key →", e.key)}
            className=""
            inputClassName=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   7. NumberField
═══════════════════════════════════════════════════════════════ */
export function NumberFieldExample() {
    const [qty, setQty] = useState(1);
    const [error, setError] = useState("");

    return (
        <NumberField
            label="Quantity"
            value={qty}
            setValue={setQty}
            onChange={(value, event) => console.log("qty →", value)}
            min={1}
            max={99}
            step={1}
            placeholder="0"
            name="quantity"
            id="qty-field"
            required={true}
            disabled={false}
            helperText="Maximum 99 items per order"
            error={error}
            showError={true}
            onBlur={() => setError(qty < 1 ? "Quantity must be at least 1." : "")}
            onFocus={() => setError("")}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   8. SelectField
═══════════════════════════════════════════════════════════════ */
export function SelectFieldExample() {
    const [country, setCountry] = useState("");
    const [error, setError] = useState("");

    return (
        <SelectField
            label="Country"
            value={country}
            setValue={setCountry}
            onChange={(value, event) => console.log("country →", value)}
            options={[
                { value: "bd", label: "Bangladesh" },
                { value: "us", label: "United States" },
                { value: "gb", label: "United Kingdom" },
                { value: "in", label: "India" },
                { value: "de", label: "Germany", disabled: true },
            ]}
            placeholder="Select your country"
            suggestions={[
                { value: "bd", label: "Bangladesh" },
                { value: "us", label: "United States" },
            ]}
            name="country"
            id="country-field"
            required={true}
            disabled={false}
            helperText="Select the country you reside in"
            error={error}
            showError={true}
            onBlur={() => setError(!country ? "Please select a country." : "")}
            onFocus={() => setError("")}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   9. SearchableSelect
═══════════════════════════════════════════════════════════════ */
export function SearchableSelectExample() {
    const [framework, setFramework] = useState("");
    const [error, setError] = useState("");

    return (
        <SearchableSelect
            label="Framework"
            value={framework}
            setValue={setFramework}
            onChange={(value, option) => console.log("framework →", value, option)}
            options={[
                { value: "react", label: "React", description: "Meta's UI library" },
                { value: "vue", label: "Vue.js", description: "Progressive framework" },
                { value: "svelte", label: "Svelte", description: "Cybernetically enhanced" },
                { value: "angular", label: "Angular", description: "Google's full framework" },
                { value: "solid", label: "SolidJS", description: "Fine-grained reactivity" },
            ]}
            placeholder="Search frameworks..."
            suggestions={[
                { value: "react", label: "React" },
                { value: "vue", label: "Vue.js" },
            ]}
            name="framework"
            id="framework-field"
            required={true}
            disabled={false}
            clearable={true}
            helperText="Select the primary frontend framework"
            error={error}
            showError={true}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   10. DateField
═══════════════════════════════════════════════════════════════ */
export function DateFieldExample() {
    const [dob, setDob] = useState("");
    const [error, setError] = useState("");

    const today = new Date().toISOString().split("T")[0];
    const minDate = "1900-01-01";

    return (
        <DateField
            label="Date of Birth"
            value={dob}
            setValue={setDob}
            onChange={(value, event) => console.log("dob →", value)}
            min={minDate}
            max={today}
            name="dob"
            id="dob-field"
            required={true}
            disabled={false}
            helperText="You must be at least 18 years old"
            error={error}
            showError={true}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   11. TimeField
═══════════════════════════════════════════════════════════════ */
export function TimeFieldExample() {
    const [time, setTime] = useState("");
    const [error, setError] = useState("");

    return (
        <TimeField
            label="Meeting Time"
            value={time}
            setValue={setTime}
            onChange={(value, event) => console.log("time →", value)}
            min="09:00"
            max="17:00"
            name="meetingTime"
            id="time-field"
            required={true}
            disabled={false}
            helperText="Business hours: 9 AM – 5 PM"
            error={error}
            showError={true}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   12. CalendarField
═══════════════════════════════════════════════════════════════ */
export function CalendarFieldExample() {
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    const today = new Date().toISOString().split("T")[0];

    return (
        <CalendarField
            label="Event Date"
            value={date}
            setValue={setDate}
            onChange={(value) => console.log("date →", value)}
            min={today}
            max="2026-12-31"
            placeholder="Pick a date"
            name="eventDate"
            id="calendar-field"
            required={true}
            disabled={false}
            helperText="Select a future date for your event"
            error={error}
            showError={true}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   13. RadioGroup
═══════════════════════════════════════════════════════════════ */
export function RadioGroupExample() {
    const [plan, setPlan] = useState("");
    const [error, setError] = useState("");

    return (
        <RadioGroup
            label="Subscription Plan"
            value={plan}
            setValue={setPlan}
            onChange={(value) => console.log("plan →", value)}
            options={[
                { value: "free", label: "Free", description: "Basic features only" },
                { value: "pro", label: "Pro", description: "All features, $9/mo" },
                { value: "team", label: "Team", description: "For teams, $29/mo" },
                { value: "enterprise", label: "Enterprise", description: "Custom pricing", disabled: true },
            ]}
            direction="vertical"          /* "vertical" | "horizontal" */
            required={true}
            disabled={false}
            helperText="You can change your plan anytime"
            error={error}
            showError={true}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   14. CheckboxGroup
═══════════════════════════════════════════════════════════════ */
export function CheckboxGroupExample() {
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState("");

    return (
        <CheckboxGroup
            label="Tech Skills"
            value={skills}
            setValue={setSkills}
            onChange={(values) => console.log("skills →", values)}
            options={[
                { value: "react", label: "React", description: "UI library" },
                { value: "typescript", label: "TypeScript", description: "Typed JS" },
                { value: "node", label: "Node.js", description: "Server-side JS" },
                { value: "graphql", label: "GraphQL", description: "API query language" },
                { value: "postgres", label: "PostgreSQL", description: "Relational DB", disabled: false },
            ]}
            direction="vertical"          /* "vertical" | "horizontal" */
            min={1}
            max={3}
            required={true}
            disabled={false}
            helperText="Select up to 3 skills"
            error={error}
            showError={true}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   15. SwitchField
═══════════════════════════════════════════════════════════════ */
export function SwitchFieldExample() {
    const [notify, setNotify] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Switch on the right (default) */}
            <SwitchField
                label="Notifications"
                switchLabel="Email notifications"
                description="Receive product updates and announcements via email"
                value={notify}
                setValue={setNotify}
                onChange={(value) => console.log("notify →", value)}
                switchPosition="right"    /* "right" | "left" */
                disabled={false}
                helperText="You can unsubscribe anytime"
                error=""
                showError={true}
                className=""
            />

            {/* Switch on the left */}
            <SwitchField
                label=""
                switchLabel="Dark Mode"
                description="Switch between light and dark theme"
                value={darkMode}
                setValue={setDarkMode}
                onChange={(value) => console.log("darkMode →", value)}
                switchPosition="left"
                disabled={false}
                helperText=""
                error=""
                showError={true}
                className=""
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   16. TagsField
═══════════════════════════════════════════════════════════════ */
export function TagsFieldExample() {
    const [tags, setTags] = useState(["Shopify", "Liquid"]);
    const [error, setError] = useState("");

    return (
        <TagsField
            label="Tech Stack"
            value={tags}
            setValue={setTags}
            onChange={(values) => console.log("tags →", values)}
            placeholder="Add a technology..."
            max={8}
            maxLength={30}
            suggestions={["React", "TypeScript", "Node.js", "GraphQL", "Prisma", "MySQL"]}
            validate={(tag) => {
                if (tag.length < 2) return "Tag must be at least 2 characters.";
                if (tags.includes(tag)) return "Tag already added.";
                return null;
            }}
            disabled={false}
            helperText="Press Enter or comma to add. Max 8 tags."
            error={error}
            showError={true}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   17. UrlField
═══════════════════════════════════════════════════════════════ */
export function UrlFieldExample() {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    return (
        <UrlField
            label="Portfolio Website"
            value={url}
            setValue={setUrl}
            onChange={(value, event) => console.log("url →", value)}
            placeholder="https://yoursite.com"
            showPreview={true}
            name="portfolioUrl"
            id="url-field"
            required={false}
            disabled={false}
            maxLength={500}
            helperText="Your public portfolio URL"
            error={error}
            showError={true}
            className=""
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   18. ImagePickerField
═══════════════════════════════════════════════════════════════ */
export function ImagePickerFieldExample() {
    const [avatar, setAvatar] = useState([]);
    const [gallery, setGallery] = useState([]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Single image — avatar */}
            <ImagePickerField
                label="Profile Photo"
                value={avatar}
                setValue={setAvatar}
                onChange={(files) => console.log("avatar →", files)}
                multiple={false}
                maxFiles={1}
                maxSize={2 * 1024 * 1024}       /* 2 MB */
                helperText="Max 2 MB. JPG or PNG."
                error=""
                showError={true}
                disabled={false}
                className=""
                previewWidth="auto"
                previewMode="list"              /* irrelevant in single mode */
            />

            {/* Multi image — grid view */}
            <ImagePickerField
                label="Gallery Images"
                value={gallery}
                setValue={setGallery}
                onChange={(files) => console.log("gallery →", files)}
                multiple={true}
                maxFiles={8}
                maxSize={5 * 1024 * 1024}       /* 5 MB */
                helperText="Up to 8 images, max 5 MB each."
                error=""
                showError={true}
                disabled={false}
                className=""
                previewWidth="auto"
                previewMode="grid"              /* "list" | "grid" */
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   19. VideoPickerField
═══════════════════════════════════════════════════════════════ */
export function VideoPickerFieldExample() {
    const [introVideo, setIntroVideo] = useState([]);
    const [courseVideos, setCourseVideos] = useState([]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Single video */}
            <VideoPickerField
                label="Intro Video"
                value={introVideo}
                setValue={setIntroVideo}
                onChange={(files) => console.log("intro video →", files)}
                multiple={false}
                maxFiles={1}
                maxSize={100 * 1024 * 1024}     /* 100 MB */
                helperText="Max 100 MB. MP4 recommended."
                error=""
                showError={true}
                disabled={false}
                className=""
                previewWidth="auto"
                previewMode="list"
            />

            {/* Multi video — list view */}
            <VideoPickerField
                label="Course Videos"
                value={courseVideos}
                setValue={setCourseVideos}
                onChange={(files) => console.log("course videos →", files)}
                multiple={true}
                maxFiles={5}
                maxSize={200 * 1024 * 1024}     /* 200 MB */
                helperText="Up to 5 videos, max 200 MB each."
                error=""
                showError={true}
                disabled={false}
                className=""
                previewWidth="auto"
                previewMode="list"              /* "list" | "grid" */
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   20. FilePickerField
═══════════════════════════════════════════════════════════════ */
export function FilePickerFieldExample() {
    const [resume, setResume] = useState([]);
    const [attachments, setAttachments] = useState([]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Single file — resume */}
            <FilePickerField
                label="Resume / CV"
                value={resume}
                setValue={setResume}
                onChange={(files) => console.log("resume →", files)}
                accept=".pdf,.doc,.docx"
                multiple={false}
                maxFiles={1}
                maxSize={5 * 1024 * 1024}       /* 5 MB */
                helperText="PDF or Word document, max 5 MB"
                error=""
                showError={true}
                disabled={false}
                className=""
                previewMode="list"
            />

            {/* Multi file — grid view */}
            <FilePickerField
                label="Attachments"
                value={attachments}
                setValue={setAttachments}
                onChange={(files) => console.log("attachments →", files)}
                accept=".pdf,.docx,.xlsx,.jpg,.png"
                multiple={true}
                maxFiles={5}
                maxSize={10 * 1024 * 1024}      /* 10 MB */
                helperText="Up to 5 files, max 10 MB each."
                error=""
                showError={true}
                disabled={false}
                className=""
                previewMode="grid"              /* "list" | "grid" */
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   21. SearchField
═══════════════════════════════════════════════════════════════ */
export function SearchFieldExample() {
    const [simpleQuery, setSimpleQuery] = useState("");
    const [simpleResults, setSimpleResults] = useState([]);

    const [richQuery, setRichQuery] = useState("");
    const [richResults, setRichResults] = useState([]);
    const [loading, setLoading] = useState(false);

    /* Simple string search */
    const handleSimpleSearch = (query) => {
        const fruits = ["Apple", "Banana", "Blueberry", "Cherry", "Grape", "Mango", "Orange", "Pear", "Strawberry"];
        setSimpleResults(fruits.filter((f) => f.toLowerCase().includes(query.toLowerCase())));
    };

    /* Rich object search — simulates async fetch */
    const handleRichSearch = async (query) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));   /* fake latency */
        setRichResults(
            MOCK_USERS.filter(
                (u) =>
                    u.name.toLowerCase().includes(query.toLowerCase()) ||
                    u.email.toLowerCase().includes(query.toLowerCase())
            )
        );
        setLoading(false);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Simple — string array results */}
            <SearchField
                label="Search Fruits"
                value={simpleQuery}
                setValue={setSimpleQuery}
                onChange={(value, event) => console.log("query →", value)}
                onSearch={handleSimpleSearch}
                results={simpleResults}
                onSelect={(item) => console.log("selected →", item)}
                resultFormat="simple"           /* "simple" | "rich" */
                showInnerSearch={true}
                popupMaxHeight={320}
                loading={false}
                placeholder="Search fruits..."
                emptyText="No fruits found"
                required={false}
                disabled={false}
                helperText="Press Enter or click the search button"
                error=""
                showError={true}
                id="search-simple"
                className=""
            />

            {/* Rich — object array results with avatar, name, description */}
            <SearchField
                label="Search Users"
                value={richQuery}
                setValue={setRichQuery}
                onChange={(value, event) => console.log("user query →", value)}
                onSearch={handleRichSearch}
                results={richResults}
                onSelect={(user) => console.log("selected user →", user)}
                resultFormat="rich"
                showInnerSearch={true}
                popupMaxHeight={320}
                loading={loading}
                placeholder="Search by name or email..."
                emptyText="No users found"
                required={false}
                disabled={false}
                helperText="Results auto-detect name, email, and description fields"
                error=""
                showError={true}
                id="search-rich"
                className=""
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Root demo — সব component এক পেজে
═══════════════════════════════════════════════════════════════ */
const DEMOS = [
    { title: "FormFieldMessage", Component: FormFieldMessageExample },
    { title: "TextField", Component: TextFieldExample },
    { title: "EmailField", Component: EmailFieldExample },
    { title: "PhoneField", Component: PhoneFieldExample },
    { title: "PasswordField", Component: PasswordFieldExample },
    { title: "TextArea", Component: TextAreaExample },
    { title: "NumberField", Component: NumberFieldExample },
    { title: "SelectField", Component: SelectFieldExample },
    { title: "SearchableSelect", Component: SearchableSelectExample },
    { title: "DateField", Component: DateFieldExample },
    { title: "TimeField", Component: TimeFieldExample },
    { title: "CalendarField", Component: CalendarFieldExample },
    { title: "RadioGroup", Component: RadioGroupExample },
    { title: "CheckboxGroup", Component: CheckboxGroupExample },
    { title: "SwitchField", Component: SwitchFieldExample },
    { title: "TagsField", Component: TagsFieldExample },
    { title: "UrlField", Component: UrlFieldExample },
    { title: "ImagePickerField", Component: ImagePickerFieldExample },
    { title: "VideoPickerField", Component: VideoPickerFieldExample },
    { title: "FilePickerField", Component: FilePickerFieldExample },
    { title: "SearchField", Component: SearchFieldExample },
];

export default function FormFieldsUsageExamples() {
    return (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {DEMOS.map(({ title, Component }, i) => (
                <section key={title}>
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "#888", marginBottom: "0.75rem" }}>
                        {i + 1}. {title}
                    </p>
                    <Component />
                </section>
            ))}
        </div>
    );
}