import { useState } from "react";

// ─── Paste the entire FormComponents source above this line ───
import {
  FormFieldMessage, FormFieldErrors, FieldCard, FieldsetField,
  TextField, EmailField, PhoneField, PasswordField, TextArea,
  NumberField, SelectField, SearchableSelect, DateField, TimeField,
  CalendarField, RadioGroup, RadioField, CheckboxGroup, CheckboxField,
  SwitchField, TagsField, UrlField, ImagePickerField, VideoPickerField,
  FilePickerField, ColorPickerField, BooleanField, JsonField, SearchField,
} from "./FormComponents";

export default function AllFieldExamples() {
  // ── State ──────────────────────────────────────────────────────────
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [password, setPassword]   = useState("");
  const [bio, setBio]             = useState("");
  const [qty, setQty]             = useState(1);
  const [country, setCountry]     = useState("");
  const [framework, setFramework] = useState("");
  const [dob, setDob]             = useState("");
  const [meetTime, setMeetTime]   = useState("");
  const [eventDate, setEventDate] = useState("");
  const [plan, setPlan]           = useState("");
  const [shipSame, setShipSame]   = useState(false);
  const [skills, setSkills]       = useState([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [darkMode, setDarkMode]   = useState(false);
  const [stack, setStack]         = useState([]);
  const [portfolio, setPortfolio] = useState("");
  const [avatar, setAvatar]       = useState([]);
  const [gallery, setGallery]     = useState([]);
  const [introVideo, setIntroVideo] = useState([]);
  const [resume, setResume]       = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [brandColor, setBrandColor]   = useState("#d4a843");
  const [accentColor, setAccentColor] = useState("#60a5fa");
  const [pickedColor, setPickedColor] = useState("#4ade80");
  const [accepted, setAccepted]   = useState(null);
  const [config, setConfig]       = useState('{\n  "debug": true,\n  "version": 1\n}');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // ── Helpers ────────────────────────────────────────────────────────
  const fakeSearch = (q) => {
    const all = [
      { name: "Alice Johnson", email: "alice@example.com", avatar: "" },
      { name: "Bob Smith",     email: "bob@example.com",   avatar: "" },
      { name: "Carol White",   email: "carol@example.com", avatar: "" },
      { name: "David Lee",     email: "david@example.com", avatar: "" },
    ];
    setSearchResults(all.filter(u => u.name.toLowerCase().includes(q.toLowerCase())));
  };

  const s = { marginBottom: "2rem" };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem", fontFamily: "sans-serif" }}>

      {/* ── 1. TextField ──────────────────────────────────────────── */}
      <div style={s}>
        <TextField
          label="Full Name"
          value={name}
          setValue={setName}
          placeholder="John Doe"
          required
          maxLength={80}
          info="Public display name"
          helperText="As it appears on your ID"
          error={name.length > 0 && name.length < 3 ? "Name must be at least 3 characters" : ""}
          leftIcon={<span>👤</span>}
          floatingLabel={false}
          throttle={200}
          onChange={(v) => console.log("TextField onChange:", v)}
          onBlur={() => console.log("blur")}
        />
      </div>

      {/* ── 2. EmailField ─────────────────────────────────────────── */}
      <div style={s}>
        <EmailField
          label="Email Address"
          value={email}
          setValue={setEmail}
          placeholder="you@example.com"
          required
          validateFormat
          info="Work email preferred"
          helperText="We'll never share your email."
          floatingLabel={false}
          fieldset={false}
          legend=""
          onChange={(v) => console.log("EmailField onChange:", v)}
        />
      </div>

      {/* ── 3. PhoneField ─────────────────────────────────────────── */}
      <div style={s}>
        <PhoneField
          label="Phone Number"
          value={phone}
          setValue={setPhone}
          placeholder="1712 345 678"
          defaultCountryCode="+880"
          required
          info="Mobile preferred"
          helperText="Include area code"
          error=""
          onChange={(v) => console.log("PhoneField onChange:", v)}
        />
      </div>

      {/* ── 4. PasswordField ──────────────────────────────────────── */}
      <div style={s}>
        <PasswordField
          label="Password"
          value={password}
          setValue={setPassword}
          placeholder="Enter password"
          required
          maxLength={128}
          autoFocus={false}
          info="Min 8 chars"
          helperText="Include a number and a symbol"
          error={password.length > 0 && password.length < 8 ? "Too short" : ""}
          onChange={(v) => console.log("PasswordField onChange:", v)}
        />
      </div>

      {/* ── 5. TextArea ───────────────────────────────────────────── */}
      <div style={s}>
        <TextArea
          label="Bio"
          value={bio}
          setValue={setBio}
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={500}
          minLength={10}
          required
          info="Shown on your profile"
          helperText="Keep it concise and friendly."
          error={bio.length > 0 && bio.length < 10 ? "Too short" : ""}
          throttle={300}
          onChange={(v) => console.log("TextArea onChange:", v)}
        />
      </div>

      {/* ── 6. NumberField ────────────────────────────────────────── */}
      <div style={s}>
        <NumberField
          label="Quantity"
          value={qty}
          setValue={setQty}
          min={1}
          max={99}
          step={1}
          placeholder="0"
          required
          info="Max 99"
          helperText="How many units do you need?"
          error={qty > 99 ? "Exceeds maximum" : ""}
          onChange={(v) => console.log("NumberField onChange:", v)}
        />
      </div>

      {/* ── 7. SelectField ────────────────────────────────────────── */}
      <div style={s}>
        <SelectField
          label="Country"
          value={country}
          setValue={setCountry}
          options={[
            { value: "bd", label: "Bangladesh" },
            { value: "us", label: "United States" },
            { value: "gb", label: "United Kingdom" },
            { value: "in", label: "India" },
          ]}
          placeholder="Select your country"
          suggestions={[{ value: "bd", label: "Bangladesh" }, { value: "us", label: "United States" }]}
          required
          info="Billing country"
          helperText="Used for tax calculations"
          error={!country ? "" : ""}
          onChange={(v) => console.log("SelectField onChange:", v)}
        />
      </div>

      {/* ── 8. SearchableSelect ───────────────────────────────────── */}
      <div style={s}>
        <SearchableSelect
          label="Framework"
          value={framework}
          setValue={setFramework}
          options={[
            { value: "react",   label: "React",   description: "Meta's UI library" },
            { value: "vue",     label: "Vue.js",  description: "Progressive framework" },
            { value: "svelte",  label: "Svelte",  description: "Cybernetically enhanced" },
            { value: "angular", label: "Angular", description: "Google's platform" },
            { value: "solid",   label: "SolidJS", description: "Fine-grained reactivity" },
          ]}
          placeholder="Search frameworks..."
          suggestions={[{ value: "react", label: "React" }]}
          clearable
          required
          info="Primary stack"
          helperText="Choose your main frontend framework"
          error=""
          onChange={(v) => console.log("SearchableSelect onChange:", v)}
        />
      </div>

      {/* ── 9. DateField ──────────────────────────────────────────── */}
      <div style={s}>
        <DateField
          label="Date of Birth"
          value={dob}
          setValue={setDob}
          max={new Date().toISOString().split("T")[0]}
          min="1900-01-01"
          required
          info="DD/MM/YYYY"
          helperText="You must be at least 18 years old"
          error=""
          onChange={(v) => console.log("DateField onChange:", v)}
        />
      </div>

      {/* ── 10. TimeField ─────────────────────────────────────────── */}
      <div style={s}>
        <TimeField
          label="Meeting Time"
          value={meetTime}
          setValue={setMeetTime}
          min="09:00"
          max="17:00"
          required
          info="24-hour format"
          helperText="Business hours: 9 AM – 5 PM"
          error=""
          onChange={(v) => console.log("TimeField onChange:", v)}
        />
      </div>

      {/* ── 11. CalendarField ─────────────────────────────────────── */}
      <div style={s}>
        <CalendarField
          label="Event Date"
          value={eventDate}
          setValue={setEventDate}
          min={new Date().toISOString().split("T")[0]}
          placeholder="Pick a date"
          required
          info="Future dates only"
          helperText="Select a future date for your event"
          error=""
          onChange={(v) => console.log("CalendarField onChange:", v)}
        />
      </div>

      {/* ── 12. RadioGroup ────────────────────────────────────────── */}
      <div style={s}>
        <RadioGroup
          label="Subscription Plan"
          value={plan}
          setValue={setPlan}
          options={[
            { value: "free",  label: "Free",  description: "Basic features only" },
            { value: "pro",   label: "Pro",   description: "All features · $9/mo" },
            { value: "team",  label: "Team",  description: "For teams · $29/mo", disabled: false },
          ]}
          direction="vertical"
          required
          info="Billed monthly"
          helperText="You can upgrade anytime"
          error={!plan ? "" : ""}
          onChange={(v) => console.log("RadioGroup onChange:", v)}
        />
      </div>

      {/* ── 12b. RadioField ───────────────────────────────────────── */}
      <div style={s}>
        <RadioField
          label="Ship to billing address"
          description="Use the address on file for delivery."
          checked={shipSame}
          setValue={setShipSame}
          showSelectedStyle
          required={false}
          info="Saves a step"
          helperText=""
          error=""
          onChange={(v) => console.log("RadioField onChange:", v)}
        />
      </div>

      {/* ── 13. CheckboxGroup ─────────────────────────────────────── */}
      <div style={s}>
        <CheckboxGroup
          label="Tech Skills"
          value={skills}
          setValue={setSkills}
          options={["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "Docker"]}
          direction="horizontal"
          max={3}
          required
          info="Pick up to 3"
          helperText="Select your strongest skills"
          error={skills.length === 0 ? "" : ""}
          onChange={(v) => console.log("CheckboxGroup onChange:", v)}
        />
      </div>

      {/* ── 13b. CheckboxField ────────────────────────────────────── */}
      <div style={s}>
        <CheckboxField
          label="Accept Terms & Conditions"
          description="You agree to our terms of service and privacy policy."
          value={acceptTerms}
          setValue={setAcceptTerms}
          showCheckedStyle
          required
          info="Required"
          helperText=""
          error={!acceptTerms ? "" : ""}
          onChange={(v) => console.log("CheckboxField onChange:", v)}
        />
      </div>

      {/* ── 14. SwitchField ───────────────────────────────────────── */}
      <div style={s}>
        <SwitchField
          label="Preferences"
          switchLabel="Dark Mode"
          description="Use dark theme across the app"
          value={darkMode}
          setValue={setDarkMode}
          switchPosition="right"
          showOnClass={false}
          disabled={false}
          info=""
          helperText="You can change this anytime"
          error=""
          onChange={(v) => console.log("SwitchField onChange:", v)}
        />
      </div>

      {/* ── 15. TagsField ─────────────────────────────────────────── */}
      <div style={s}>
        <TagsField
          label="Tech Stack"
          value={stack}
          setValue={setStack}
          placeholder="Add a technology..."
          suggestions={["React", "TypeScript", "Tailwind", "Node.js", "Prisma"]}
          max={8}
          maxLength={20}
          disabled={false}
          info="Max 8 tags"
          helperText="Press Enter or comma to add"
          error=""
          validate={(tag) => tag.length < 2 ? "Tag too short" : null}
          onChange={(v) => console.log("TagsField onChange:", v)}
        />
      </div>

      {/* ── 16. UrlField ──────────────────────────────────────────── */}
      <div style={s}>
        <UrlField
          label="Portfolio Website"
          value={portfolio}
          setValue={setPortfolio}
          placeholder="https://yoursite.com"
          showPreview
          required={false}
          maxLength={200}
          info="Public URL"
          helperText="Your public portfolio link"
          error=""
          onChange={(v) => console.log("UrlField onChange:", v)}
        />
      </div>

      {/* ── 17. ImagePickerField — avatar variant ─────────────────── */}
      <div style={s}>
        <ImagePickerField
          label="Profile Photo"
          value={avatar}
          setValue={setAvatar}
          multiple={false}
          variant="avatar"
          avatarShape="circle"
          avatarPosition="left"
          showDot
          dotDisabled={false}
          showFileName
          maxSize={2 * 1024 * 1024}
          helperText="Max 2 MB · JPG or PNG"
          error=""
          onChange={(files) => console.log("ImagePickerField (avatar) onChange:", files)}
        />
      </div>

      {/* ── 17b. ImagePickerField — multi grid ────────────────────── */}
      <div style={s}>
        <ImagePickerField
          label="Gallery Images"
          value={gallery}
          setValue={setGallery}
          multiple
          maxFiles={6}
          maxSize={5 * 1024 * 1024}
          previewMode="grid"
          helperText="Up to 6 images · Max 5 MB each"
          error=""
          onChange={(files) => console.log("ImagePickerField (gallery) onChange:", files)}
        />
      </div>

      {/* ── 18. VideoPickerField ──────────────────────────────────── */}
      <div style={s}>
        <VideoPickerField
          label="Intro Video"
          value={introVideo}
          setValue={setIntroVideo}
          multiple={false}
          variant="card"
          maxSize={100 * 1024 * 1024}
          previewMode="list"
          helperText="Max 100 MB · MP4 recommended"
          error=""
          onChange={(files) => console.log("VideoPickerField onChange:", files)}
        />
      </div>

      {/* ── 19. FilePickerField — single ──────────────────────────── */}
      <div style={s}>
        <FilePickerField
          label="Resume / CV"
          value={resume}
          setValue={setResume}
          accept=".pdf,.doc,.docx"
          multiple={false}
          variant="card"
          maxSize={5 * 1024 * 1024}
          helperText="PDF or Word · Max 5 MB"
          error=""
          onChange={(files) => console.log("FilePickerField (resume) onChange:", files)}
        />
      </div>

      {/* ── 19b. FilePickerField — multi list ─────────────────────── */}
      <div style={s}>
        <FilePickerField
          label="Attachments"
          value={attachments}
          setValue={setAttachments}
          accept=".pdf,.png,.jpg,.zip"
          multiple
          maxFiles={5}
          maxSize={10 * 1024 * 1024}
          previewMode="list"
          helperText="Up to 5 files · Max 10 MB each"
          error=""
          onChange={(files) => console.log("FilePickerField (attachments) onChange:", files)}
        />
      </div>

      {/* ── 20a. ColorPickerField — swatches ──────────────────────── */}
      <div style={s}>
        <ColorPickerField
          label="Brand Color"
          value={brandColor}
          setValue={setBrandColor}
          variant="swatches"
          allowCustom
          swatches={[
            "#d4a843","#f87171","#fb923c","#fbbf24",
            "#4ade80","#34d399","#60a5fa","#818cf8",
            "#a78bfa","#e879f9","#f472b6","#94a3b8",
            "#ffffff","#000000",
          ]}
          info="Brand kit"
          helperText="Pick from the palette or enter a custom hex"
          error=""
          debounce={0}
          onChange={(hex) => console.log("ColorPickerField (swatches) onChange:", hex)}
        />
      </div>

      {/* ── 20b. ColorPickerField — input ─────────────────────────── */}
      <div style={s}>
        <ColorPickerField
          label="Accent Color"
          value={accentColor}
          setValue={setAccentColor}
          variant="input"
          info="Hex value"
          helperText="Click the swatch to open the color wheel"
          error=""
          debounce={150}
          onChange={(hex) => console.log("ColorPickerField (input) onChange:", hex)}
        />
      </div>

      {/* ── 20c. ColorPickerField — picker ────────────────────────── */}
      <div style={s}>
        <ColorPickerField
          label="Highlight Color"
          value={pickedColor}
          setValue={setPickedColor}
          variant="picker"
          info="RGB breakdown"
          helperText="Click the color wheel to pick"
          error=""
          debounce={0}
          onChange={(hex) => console.log("ColorPickerField (picker) onChange:", hex)}
        />
      </div>

      {/* ── 21. BooleanField ──────────────────────────────────────── */}
      <div style={s}>
        <BooleanField
          label="Accept Terms"
          value={accepted}
          setValue={setAccepted}
          trueLabel="I agree"
          falseLabel="Decline"
          required
          info="Required to continue"
          helperText="Click the same button again to deselect"
          error={accepted === null ? "" : ""}
          onChange={(v) => console.log("BooleanField onChange:", v)}
        />
      </div>

      {/* ── 22. JsonField ─────────────────────────────────────────── */}
      <div style={s}>
        <JsonField
          label="Config JSON"
          value={config}
          setValue={setConfig}
          rows={8}
          required={false}
          placeholder={'{\n  "key": "value"\n}'}
          info="Raw JSON"
          helperText="Paste valid JSON — use Format to prettify"
          error=""
          onChange={(raw, parsed) => console.log("JsonField onChange:", parsed)}
        />
      </div>

      {/* ── 23. SearchField ───────────────────────────────────────── */}
      <div style={s}>
        <SearchField
          label="Search Users"
          value={searchQuery}
          setValue={setSearchQuery}
          onSearch={fakeSearch}
          debounce={300}
          results={searchResults}
          resultFormat="rich"
          showInnerSearch
          popupMaxHeight={280}
          loading={false}
          placeholder="Search by name..."
          emptyText="No users found"
          required={false}
          info="Live search"
          helperText="Type at least 1 character to search"
          error=""
          onSelect={(user) => {
            console.log("SearchField onSelect:", user);
            setSearchQuery(user.name);
            setSearchResults([]);
          }}
          onChange={(v) => console.log("SearchField onChange:", v)}
        />
      </div>

      {/* ── FormFieldMessage standalone ───────────────────────────── */}
      <div style={s}>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>FormFieldMessage (standalone):</p>
        <FormFieldMessage
          hasError={false}
          helperText="This is a standalone helper message."
        />
        <FormFieldMessage
          hasError
          error="This is a standalone error message."
        />
      </div>

      {/* ── FormFieldErrors standalone ────────────────────────────── */}
      <div style={s}>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>FormFieldErrors (standalone):</p>
        <FormFieldErrors
          errors={[
            { file: "photo.jpg", message: "File exceeds the 2 MB size limit.", code: "FILE_TOO_LARGE" },
            { message: "Atomic upload rejected: 1 error(s) found.", code: "ATOMIC_BATCH_REJECTED" },
          ]}
        />
      </div>

      {/* ── FieldCard wrapper ─────────────────────────────────────── */}
      <div style={s}>
        <FieldCard title="Personal Information" description="Used for your public profile">
          <TextField
            label="Display Name"
            value={name}
            setValue={setName}
            placeholder="Your display name"
            helperText="Shown on your public profile"
          />
          <EmailField
            label="Email"
            value={email}
            setValue={setEmail}
            placeholder="you@example.com"
          />
        </FieldCard>
      </div>

      {/* ── FieldsetField wrapper ─────────────────────────────────── */}
      <div style={s}>
        <FieldsetField legend="Shipping Address">
          <TextField label="Street"   value=""  setValue={() => {}} placeholder="123 Main St" />
          <TextField label="City"     value=""  setValue={() => {}} placeholder="Dhaka" />
          <TextField label="ZIP Code" value=""  setValue={() => {}} placeholder="1212" />
        </FieldsetField>
      </div>

    </div>
  );
}
