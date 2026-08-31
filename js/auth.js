/**
 * MEDWAY AI - User Authentication & Profile System
 * Handles login, logout, profile picture selection, theme toggling, profile management modal, and localStorage persistence.
 */

(function () {
    const STORAGE_KEY = 'medway_user';
    const THEME_KEY = 'medway-theme';

    const scriptTag = document.querySelector('script[src*="auth.js"]');
    const ROOT_PATH = scriptTag ? scriptTag.src.split('js/auth.js')[0] : '';

    // Preset Avatars
    const PRESET_AVATARS = [
        ROOT_PATH + 'img/user.jpg',
        ROOT_PATH + 'img/testimonial-1.jpg',
        ROOT_PATH + 'img/testimonial-2.jpg',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    ];

    let selectedAvatar = ROOT_PATH + 'img/user.jpg';

    // Get stored user data
    function getAuthUser() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return null;
            const parsed = JSON.parse(data);
            return parsed && parsed.isLoggedIn ? parsed : null;
        } catch (e) {
            return null;
        }
    }

    // Save user data
    function setAuthUser(user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        renderAuthState();
    }

    // Logout user
    function logoutUser() {
        localStorage.removeItem(STORAGE_KEY);
        renderAuthState();
    }

    // Theme helpers
    function getActiveTheme() {
        return localStorage.getItem(THEME_KEY) || 'light';
    }

    function setActiveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.backgroundColor = theme === 'light' ? '#eef0f3' : '#0a0b0e';
        
        // Update all theme toggle buttons on page
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.setAttribute('aria-pressed', theme === 'light');
        });

        // Update modal theme toggle UI
        const lightRadio = document.getElementById('themeLightRadio');
        const darkRadio = document.getElementById('themeDarkRadio');
        if (lightRadio && darkRadio) {
            if (theme === 'light') lightRadio.checked = true;
            else darkRadio.checked = true;
        }

        // Update profile dropdown badge
        const badge = document.getElementById('dropdownThemeBadge');
        if (badge) {
            badge.textContent = theme.toUpperCase();
            badge.className = theme === 'light' ? 'badge bg-warning text-dark' : 'badge bg-primary';
        }
    }

    function toggleTheme() {
        const nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';
        setActiveTheme(nextTheme);
    }

    // Inject Login Auth Modal into DOM
    function ensureLoginModalExists() {
        if (document.getElementById('authLoginModal')) return;

        const user = getAuthUser();
        if (user && user.avatar) {
            selectedAvatar = user.avatar;
        }

        const currentTheme = getActiveTheme();

        const modalHTML = `
        <div class="modal fade" id="authLoginModal" tabindex="-1" aria-labelledby="authLoginModalLabel" aria-hidden="true" style="z-index: 1060;">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content text-white border-0 shadow-lg" style="background-color: var(--bg-panel-solid, #15161a) !important; border: 1px solid var(--border-soft, rgba(255, 255, 255, 0.15)) !important; border-radius: 14px; backdrop-filter: blur(12px);">
                    <div class="modal-header border-bottom border-secondary">
                        <h5 class="modal-title text-primary fw-bold" id="authLoginModalLabel">
                            <i class="fa fa-user-circle me-2"></i>Sign In to MEDWAY AI
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form id="authLoginForm">
                            <!-- Name input -->
                            <div class="mb-3">
                                <label for="authUserNameInput" class="form-label text-light small fw-bold">Full Name</label>
                                <input type="text" class="form-control bg-dark text-white border-secondary" id="authUserNameInput" placeholder="Enter your name (e.g. John Doe)" required value="${user ? user.name : 'John Doe'}">
                            </div>

                            <!-- Email input -->
                            <div class="mb-3">
                                <label for="authUserEmailInput" class="form-label text-light small fw-bold">Email Address (Optional)</label>
                                <input type="email" class="form-control bg-dark text-white border-secondary" id="authUserEmailInput" placeholder="johndoe@medway.ai" value="${user ? user.email || '' : 'johndoe@medway.ai'}">
                            </div>

                            <!-- Profile Picture Selection -->
                            <div class="mb-3">
                                <label class="form-label text-light small fw-bold d-block">Select Profile Picture</label>
                                <div class="d-flex align-items-center gap-2 mb-2 flex-wrap" id="avatarPresetContainer">
                                    ${PRESET_AVATARS.map((url, idx) => `
                                        <div class="avatar-option position-relative rounded-circle overflow-hidden" data-avatar="${url}" style="width: 44px; height: 44px; border: 2px solid ${selectedAvatar === url ? 'var(--accent, #eb1616)' : 'transparent'}; cursor: pointer; transition: all 0.2s ease;">
                                            <img src="${url}" alt="Avatar ${idx+1}" style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                    `).join('')}
                                    <div id="customAvatarBtn" class="avatar-option rounded-circle d-flex align-items-center justify-content-center bg-dark text-secondary border border-secondary" style="width: 44px; height: 44px; cursor: pointer; transition: all 0.2s ease;" title="Upload custom photo">
                                        <i class="fa fa-upload"></i>
                                    </div>
                                </div>
                                <input type="file" id="authAvatarFileInput" accept="image/*" class="d-none">
                                <div id="avatarPreviewBox" class="d-flex align-items-center mt-2 ${selectedAvatar ? '' : 'd-none'}">
                                    <img id="currentAvatarPreview" src="${selectedAvatar}" class="rounded-circle me-2 border border-primary" style="width: 32px; height: 32px; object-fit: cover;">
                                    <span class="small text-muted" id="avatarPreviewText">Selected Profile Picture</span>
                                </div>
                            </div>

                            <!-- Theme Selection Toggle -->
                            <div class="mb-4">
                                <label class="form-label text-light small fw-bold d-block">Theme Preference</label>
                                <div class="btn-group w-100" role="group">
                                    <input type="radio" class="btn-check" name="modalThemeRadio" id="themeLightRadio" ${currentTheme === 'light' ? 'checked' : ''}>
                                    <label class="btn btn-outline-secondary py-2 small fw-bold" for="themeLightRadio">
                                        <i class="fa fa-sun text-warning me-2"></i>Light Mode
                                    </label>

                                    <input type="radio" class="btn-check" name="modalThemeRadio" id="themeDarkRadio" ${currentTheme === 'dark' ? 'checked' : ''}>
                                    <label class="btn btn-outline-secondary py-2 small fw-bold" for="themeDarkRadio">
                                        <i class="fa fa-moon text-info me-2"></i>Dark Mode
                                    </label>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="d-grid mt-4">
                                <button type="submit" class="btn btn-primary py-2 fw-bold text-uppercase" style="letter-spacing: 0.5px;">
                                    <i class="fa fa-sign-in-alt me-2"></i>Log In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Bind Avatar Selection logic
        const presetContainer = document.getElementById('avatarPresetContainer');
        if (presetContainer) {
            presetContainer.querySelectorAll('.avatar-option[data-avatar]').forEach(opt => {
                opt.addEventListener('click', function () {
                    selectedAvatar = this.getAttribute('data-avatar');
                    updateAvatarSelectionUI();
                });
            });
        }

        // Custom File Upload listener
        const customBtn = document.getElementById('customAvatarBtn');
        const fileInput = document.getElementById('authAvatarFileInput');
        if (customBtn && fileInput) {
            customBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        selectedAvatar = event.target.result;
                        updateAvatarSelectionUI();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Theme Radio toggle logic inside modal
        const lightRadio = document.getElementById('themeLightRadio');
        const darkRadio = document.getElementById('themeDarkRadio');
        if (lightRadio) {
            lightRadio.addEventListener('change', function () {
                if (this.checked) setActiveTheme('light');
            });
        }
        if (darkRadio) {
            darkRadio.addEventListener('change', function () {
                if (this.checked) setActiveTheme('dark');
            });
        }

        // Form Submit
        const form = document.getElementById('authLoginForm');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const nameInput = document.getElementById('authUserNameInput');
                const emailInput = document.getElementById('authUserEmailInput');

                const name = nameInput ? nameInput.value.trim() : 'John Doe';
                const email = emailInput ? emailInput.value.trim() : '';

                setAuthUser({
                    name: name || 'John Doe',
                    email: email,
                    role: 'Healthcare Member',
                    bloodGroup: 'O+',
                    phone: '+1 (555) 019-2834',
                    emergencyContact: 'Jane Doe (+1 555-0199)',
                    avatar: selectedAvatar || (ROOT_PATH + 'img/user.jpg'),
                    isLoggedIn: true
                });

                // Close modal
                const modalElem = document.getElementById('authLoginModal');
                if (window.bootstrap && window.bootstrap.Modal) {
                    const bsModal = window.bootstrap.Modal.getInstance(modalElem) || new window.bootstrap.Modal(modalElem);
                    bsModal.hide();
                } else if (typeof $ !== 'undefined' && $(modalElem).modal) {
                    $(modalElem).modal('hide');
                }
            });
        }
    }

    function updateAvatarSelectionUI() {
        const presetContainer = document.getElementById('avatarPresetContainer');
        if (presetContainer) {
            presetContainer.querySelectorAll('.avatar-option[data-avatar]').forEach(opt => {
                const av = opt.getAttribute('data-avatar');
                if (av === selectedAvatar) {
                    opt.style.borderColor = 'var(--accent, #eb1616)';
                    opt.style.boxShadow = '0 0 8px var(--accent-glow, rgba(235,22,22,0.5))';
                } else {
                    opt.style.borderColor = 'transparent';
                    opt.style.boxShadow = 'none';
                }
            });
        }
        const previewImg = document.getElementById('currentAvatarPreview');
        const previewBox = document.getElementById('avatarPreviewBox');
        if (previewImg && previewBox) {
            previewImg.src = selectedAvatar;
            previewBox.classList.remove('d-none');
        }
    }

    // Open Login Modal
    function openLoginModal() {
        ensureLoginModalExists();
        const user = getAuthUser();
        if (user && user.avatar) selectedAvatar = user.avatar;
        updateAvatarSelectionUI();

        const modalElem = document.getElementById('authLoginModal');
        if (window.bootstrap && window.bootstrap.Modal) {
            const bsModal = window.bootstrap.Modal.getInstance(modalElem) || new window.bootstrap.Modal(modalElem);
            bsModal.show();
        } else if (typeof $ !== 'undefined' && $(modalElem).modal) {
            $(modalElem).modal('show');
        }
    }

    // Inject My Profile Modal into DOM
    function ensureProfileModalExists() {
        if (document.getElementById('myProfileModal')) return;

        const user = getAuthUser() || { name: 'John Doe', email: 'johndoe@medway.ai', avatar: ROOT_PATH + 'img/user.jpg', role: 'Healthcare Member', phone: '+1 (555) 019-2834', bloodGroup: 'O+', emergencyContact: 'Jane Doe (+1 555-0199)' };
        let profileAvatar = user.avatar || (ROOT_PATH + 'img/user.jpg');

        const modalHTML = `
        <div class="modal fade" id="myProfileModal" tabindex="-1" aria-labelledby="myProfileModalLabel" aria-hidden="true" style="z-index: 1060;">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content text-white border-0 shadow-lg" style="background-color: var(--bg-panel-solid, #15161a) !important; border: 1px solid var(--border-soft, rgba(255, 255, 255, 0.15)) !important; border-radius: 16px; backdrop-filter: blur(16px);">
                    <div class="modal-header border-bottom border-secondary p-4">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle p-2 bg-primary bg-opacity-10 me-3 text-primary">
                                <i class="fa fa-id-card fa-2x"></i>
                            </div>
                            <div>
                                <h5 class="modal-title fw-bold text-primary mb-0" id="myProfileModalLabel">User Profile Management</h5>
                                <small class="text-muted">View & update your account details and medical ID</small>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form id="profileUpdateForm">
                            <div class="row g-4">
                                <!-- Left Column: Avatar & Summary -->
                                <div class="col-lg-4 text-center border-end border-secondary pe-lg-4">
                                    <div class="position-relative d-inline-block mb-3">
                                        <img id="profileModalAvatar" src="${profileAvatar}" class="rounded-circle shadow-lg border border-3 border-primary" style="width: 110px; height: 110px; object-fit: cover;">
                                        <button type="button" id="changeProfileAvatarBtn" class="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-2 shadow" title="Change Avatar">
                                            <i class="fa fa-camera"></i>
                                        </button>
                                    </div>
                                    <input type="file" id="profileModalFileInput" accept="image/*" class="d-none">

                                    <h5 class="fw-bold mb-1 text-light" id="profileDisplayHeaderName">${user.name || 'John Doe'}</h5>
                                    <span class="badge bg-danger bg-opacity-20 text-danger border border-danger px-3 py-1 rounded-pill mb-3" id="profileDisplayRole">${user.role || 'Healthcare Member'}</span>
                                    
                                    <div class="p-3 rounded bg-dark border border-secondary text-start mt-2">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="small text-muted"><i class="fa fa-check-circle text-success me-1"></i>Status</span>
                                            <span class="small fw-bold text-success">Verified Active</span>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="small text-muted"><i class="fa fa-heartbeat text-danger me-1"></i>Health ID</span>
                                            <span class="small fw-bold text-light">MED-99824</span>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="small text-muted"><i class="fa fa-tint text-danger me-1"></i>Blood Type</span>
                                            <span class="small fw-bold text-danger" id="profileDisplayBlood">${user.bloodGroup || 'O+'}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Right Column: Editable Details -->
                                <div class="col-lg-8 ps-lg-4">
                                    <h6 class="text-primary fw-bold mb-3"><i class="fa fa-user-edit me-2"></i>Personal Information</h6>
                                    
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label for="profileInputName" class="form-label text-light small fw-bold">Full Name</label>
                                            <input type="text" class="form-control bg-dark text-white border-secondary" id="profileInputName" required value="${user.name || 'John Doe'}">
                                        </div>

                                        <div class="col-md-6">
                                            <label for="profileInputEmail" class="form-label text-light small fw-bold">Email Address</label>
                                            <input type="email" class="form-control bg-dark text-white border-secondary" id="profileInputEmail" value="${user.email || 'johndoe@medway.ai'}">
                                        </div>

                                        <div class="col-md-6">
                                            <label for="profileInputPhone" class="form-label text-light small fw-bold">Phone Number</label>
                                            <input type="text" class="form-control bg-dark text-white border-secondary" id="profileInputPhone" placeholder="+1 (555) 000-0000" value="${user.phone || '+1 (555) 019-2834'}">
                                        </div>

                                        <div class="col-md-6">
                                            <label for="profileInputRole" class="form-label text-light small fw-bold">Account Role</label>
                                            <select class="form-select bg-dark text-white border-secondary" id="profileInputRole">
                                                <option value="Healthcare Member" ${user.role === 'Healthcare Member' ? 'selected' : ''}>Healthcare Member</option>
                                                <option value="Medical Specialist" ${user.role === 'Medical Specialist' ? 'selected' : ''}>Medical Specialist</option>
                                                <option value="Emergency Responder" ${user.role === 'Emergency Responder' ? 'selected' : ''}>Emergency Responder</option>
                                                <option value="Administrator" ${user.role === 'Administrator' ? 'selected' : ''}>Administrator</option>
                                            </select>
                                        </div>

                                        <div class="col-md-6">
                                            <label for="profileInputBlood" class="form-label text-light small fw-bold">Blood Group</label>
                                            <select class="form-select bg-dark text-white border-secondary" id="profileInputBlood">
                                                <option value="O+" ${user.bloodGroup === 'O+' ? 'selected' : ''}>O positive (O+)</option>
                                                <option value="A+" ${user.bloodGroup === 'A+' ? 'selected' : ''}>A positive (A+)</option>
                                                <option value="B+" ${user.bloodGroup === 'B+' ? 'selected' : ''}>B positive (B+)</option>
                                                <option value="AB+" ${user.bloodGroup === 'AB+' ? 'selected' : ''}>AB positive (AB+)</option>
                                                <option value="O-" ${user.bloodGroup === 'O-' ? 'selected' : ''}>O negative (O-)</option>
                                                <option value="A-" ${user.bloodGroup === 'A-' ? 'selected' : ''}>A negative (A-)</option>
                                            </select>
                                        </div>

                                        <div class="col-md-6">
                                            <label for="profileInputEmergency" class="form-label text-light small fw-bold">Emergency Contact</label>
                                            <input type="text" class="form-control bg-dark text-white border-secondary" id="profileInputEmergency" placeholder="Contact Name & Number" value="${user.emergencyContact || 'Jane Doe (+1 555-0199)'}">
                                        </div>
                                    </div>

                                    <!-- Notification Alert inside Profile -->
                                    <div class="alert alert-primary bg-primary bg-opacity-10 border-primary text-light small mt-4 mb-0 d-flex align-items-center">
                                        <i class="fa fa-info-circle fa-lg me-3 text-primary"></i>
                                        <div>Your profile data is stored securely in your browser session and updated across MEDWAY AI services.</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Footer Buttons -->
                            <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-secondary">
                                <button type="button" class="btn btn-outline-secondary px-4 fw-bold" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary px-4 fw-bold">
                                    <i class="fa fa-save me-2"></i>Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Avatar change button & file input in Profile modal
        const changeAvatarBtn = document.getElementById('changeProfileAvatarBtn');
        const fileInput = document.getElementById('profileModalFileInput');
        const modalAvatarImg = document.getElementById('profileModalAvatar');

        if (changeAvatarBtn && fileInput) {
            changeAvatarBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const newAvatar = event.target.result;
                        if (modalAvatarImg) modalAvatarImg.src = newAvatar;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Profile update form submit
        const profileForm = document.getElementById('profileUpdateForm');
        if (profileForm) {
            profileForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const nameVal = document.getElementById('profileInputName').value.trim() || 'John Doe';
                const emailVal = document.getElementById('profileInputEmail').value.trim();
                const phoneVal = document.getElementById('profileInputPhone').value.trim();
                const roleVal = document.getElementById('profileInputRole').value;
                const bloodVal = document.getElementById('profileInputBlood').value;
                const emergencyVal = document.getElementById('profileInputEmergency').value.trim();
                const avatarVal = modalAvatarImg ? modalAvatarImg.src : (ROOT_PATH + 'img/user.jpg');

                setAuthUser({
                    name: nameVal,
                    email: emailVal,
                    phone: phoneVal,
                    role: roleVal,
                    bloodGroup: bloodVal,
                    emergencyContact: emergencyVal,
                    avatar: avatarVal,
                    isLoggedIn: true
                });

                // Hide Profile Modal
                const modalElem = document.getElementById('myProfileModal');
                if (window.bootstrap && window.bootstrap.Modal) {
                    const bsModal = window.bootstrap.Modal.getInstance(modalElem) || new window.bootstrap.Modal(modalElem);
                    bsModal.hide();
                } else if (typeof $ !== 'undefined' && $(modalElem).modal) {
                    $(modalElem).modal('hide');
                }
            });
        }
    }

    // Open Profile Modal
    function openProfileModal() {
        ensureProfileModalExists();
        const user = getAuthUser();
        if (user) {
            const modalAvatarImg = document.getElementById('profileModalAvatar');
            const nameHeader = document.getElementById('profileDisplayHeaderName');
            const roleBadge = document.getElementById('profileDisplayRole');
            const bloodSpan = document.getElementById('profileDisplayBlood');

            const nameInput = document.getElementById('profileInputName');
            const emailInput = document.getElementById('profileInputEmail');
            const phoneInput = document.getElementById('profileInputPhone');
            const roleInput = document.getElementById('profileInputRole');
            const bloodInput = document.getElementById('profileInputBlood');
            const emergencyInput = document.getElementById('profileInputEmergency');

            if (modalAvatarImg) modalAvatarImg.src = user.avatar || (ROOT_PATH + 'img/user.jpg');
            if (nameHeader) nameHeader.textContent = user.name || 'John Doe';
            if (roleBadge) roleBadge.textContent = user.role || 'Healthcare Member';
            if (bloodSpan) bloodSpan.textContent = user.bloodGroup || 'O+';

            if (nameInput) nameInput.value = user.name || 'John Doe';
            if (emailInput) emailInput.value = user.email || 'johndoe@medway.ai';
            if (phoneInput) phoneInput.value = user.phone || '+1 (555) 019-2834';
            if (roleInput) roleInput.value = user.role || 'Healthcare Member';
            if (bloodInput) bloodInput.value = user.bloodGroup || 'O+';
            if (emergencyInput) emergencyInput.value = user.emergencyContact || 'Jane Doe (+1 555-0199)';
        }

        const modalElem = document.getElementById('myProfileModal');
        if (window.bootstrap && window.bootstrap.Modal) {
            const bsModal = window.bootstrap.Modal.getInstance(modalElem) || new window.bootstrap.Modal(modalElem);
            bsModal.show();
        } else if (typeof $ !== 'undefined' && $(modalElem).modal) {
            $(modalElem).modal('show');
        }
    }

    // Render Auth State & Avatar across UI elements
    function renderAuthState() {
        const user = getAuthUser();
        const currentTheme = getActiveTheme();

        // 1. Navbar Profile Dropdown & Login Button
        const dropdownToggles = document.querySelectorAll('.content .navbar .nav-item.dropdown');
        dropdownToggles.forEach(function (dropdown) {
            const isUserDropdown = Array.from(dropdown.querySelectorAll('.dropdown-item')).some(item => 
                item.textContent.trim().toLowerCase().includes('log out') || 
                item.textContent.trim().toLowerCase().includes('my profile')
            );

            if (isUserDropdown) {
                let loginBtnContainer = document.getElementById('navLoginBtnContainer');
                if (!loginBtnContainer) {
                    loginBtnContainer = document.createElement('div');
                    loginBtnContainer.id = 'navLoginBtnContainer';
                    loginBtnContainer.className = 'ms-2';
                    loginBtnContainer.innerHTML = `
                        <button type="button" class="btn btn-primary px-3 py-1 rounded-pill fw-bold" id="mainNavLoginBtn">
                            <i class="fa fa-sign-in-alt me-2"></i>Log In
                        </button>`;
                    dropdown.parentNode.insertBefore(loginBtnContainer, dropdown);

                    document.getElementById('mainNavLoginBtn').addEventListener('click', openLoginModal);
                }

                const userNameSpan = dropdown.querySelector('.dropdown-toggle span');
                const userImg = dropdown.querySelector('.dropdown-toggle img');

                // Check or inject Theme Switcher item into dropdown menu
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu && !document.getElementById('dropdownThemeToggleItem')) {
                    const themeItem = document.createElement('a');
                    themeItem.id = 'dropdownThemeToggleItem';
                    themeItem.href = 'javascript:void(0)';
                    themeItem.className = 'dropdown-item d-flex align-items-center justify-content-between';
                    themeItem.innerHTML = `
                        <span><i class="fa fa-adjust me-2"></i>Theme Mode</span>
                        <span class="${currentTheme === 'light' ? 'badge bg-warning text-dark' : 'badge bg-primary'}" id="dropdownThemeBadge">${currentTheme.toUpperCase()}</span>`;
                    themeItem.addEventListener('click', function (e) {
                        e.preventDefault();
                        toggleTheme();
                    });
                    dropdownMenu.insertBefore(themeItem, dropdownMenu.firstChild);
                }

                if (user) {
                    // Logged In state: show name & dropdown, hide login btn
                    dropdown.style.display = '';
                    loginBtnContainer.style.display = 'none';
                    if (userNameSpan) userNameSpan.textContent = user.name;
                    if (userImg && user.avatar) userImg.src = user.avatar;
                } else {
                    // Logged Out state: hide dropdown, show login btn
                    dropdown.style.display = 'none';
                    loginBtnContainer.style.display = '';
                }

                // Bind dropdown items (My Profile & Log Out)
                dropdown.querySelectorAll('.dropdown-item').forEach(function (item) {
                    const text = item.textContent.trim().toLowerCase();
                    if (text.includes('my profile')) {
                        item.setAttribute('href', 'javascript:void(0)');
                        item.onclick = function (e) {
                            e.preventDefault();
                            openProfileModal();
                        };
                    } else if (text.includes('log out')) {
                        item.setAttribute('href', 'javascript:void(0)');
                        item.onclick = function (e) {
                            e.preventDefault();
                            logoutUser();
                        };
                    }
                });
            }
        });

        // 2. Sidebar Profile Display
        const sidebarUserBox = document.querySelector('.sidebar .d-flex.align-items-center.ms-4.mb-4');
        if (sidebarUserBox) {
            let sidebarLoginBtn = document.getElementById('sidebarLoginBtn');
            const nameHeader = sidebarUserBox.querySelector('h6');
            const roleSpan = sidebarUserBox.querySelector('span');
            const sidebarImg = sidebarUserBox.querySelector('img');

            if (user) {
                if (nameHeader) nameHeader.textContent = user.name;
                if (roleSpan) roleSpan.textContent = user.role || 'Member';
                if (sidebarImg && user.avatar) sidebarImg.src = user.avatar;
                if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'none';
                sidebarUserBox.style.display = 'flex';
                sidebarUserBox.style.cursor = 'pointer';
                sidebarUserBox.onclick = function () {
                    openProfileModal();
                };
            } else {
                if (nameHeader) nameHeader.textContent = 'Guest User';
                if (roleSpan) roleSpan.textContent = 'Not logged in';
                if (sidebarImg) sidebarImg.src = ROOT_PATH + 'img/user.jpg';
                sidebarUserBox.style.cursor = 'default';
                sidebarUserBox.onclick = null;
                if (!sidebarLoginBtn) {
                    sidebarLoginBtn = document.createElement('button');
                    sidebarLoginBtn.id = 'sidebarLoginBtn';
                    sidebarLoginBtn.className = 'btn btn-sm btn-outline-primary mt-2 ms-4 me-4 w-75';
                    sidebarLoginBtn.innerHTML = '<i class="fa fa-sign-in-alt me-2"></i>Log In';
                    sidebarLoginBtn.addEventListener('click', openLoginModal);
                    sidebarUserBox.parentNode.insertBefore(sidebarLoginBtn, sidebarUserBox.nextSibling);
                }
                sidebarLoginBtn.style.display = 'block';
            }
        }
    }

    // Expose functions globally
    window.medwayAuth = {
        getUser: getAuthUser,
        setUser: setAuthUser,
        logout: logoutUser,
        openLogin: openLoginModal,
        openProfile: openProfileModal,
        toggleTheme: toggleTheme,
        render: renderAuthState
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            ensureLoginModalExists();
            ensureProfileModalExists();
            renderAuthState();
        });
    } else {
        ensureLoginModalExists();
        ensureProfileModalExists();
        renderAuthState();
    }
})();
