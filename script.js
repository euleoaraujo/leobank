document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const headerActions = document.querySelector('.header-actions');

    // Mobile Menu
    if (mobileMenuBtn && headerActions) {
        mobileMenuBtn.addEventListener('click', () => {
            headerActions.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Input Masks (Agência e Conta - Apenas números)
    const numberInputs = document.querySelectorAll('#agencia, #conta');
    numberInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    });

    // CPF Mask (000.000.000-00)
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            if (value.length > 11) value = value.slice(0, 11); // Limite 11 dígitos

            // Aplica a máscara
            if (value.length > 9) {
                value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{3})(\d{3})(\d{3}).*/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/^(\d{3})(\d{3}).*/, '$1.$2');
            }

            e.target.value = value;
        });
    }

    // Toggle PF/PJ Logic
    const selectTipo = document.getElementById('select-tipo-conta');
    const pjInputs = document.getElementById('pj-inputs');
    const pfInputs = document.getElementById('pf-inputs');

    if (selectTipo && pjInputs && pfInputs) {

        // Lógica Custom Dropdown (Desktop)
        const customSelect = document.querySelector('.custom-select');
        const selectTrigger = document.querySelector('.select-trigger');
        const customOptions = document.querySelectorAll('.option');
        const selectedText = document.getElementById('custom-select-value');

        if (customSelect && selectTrigger) {
            // Toggle dropdown
            selectTrigger.addEventListener('click', (e) => {
                // Fechar outros se houver (opcional)
                customSelect.classList.toggle('open');
                e.stopPropagation();
            });

            // Seleção de Opção
            customOptions.forEach(option => {
                option.addEventListener('click', () => {
                    // Remove selected class from all
                    customOptions.forEach(op => op.classList.remove('selected'));
                    // Add to clicked
                    option.classList.add('selected');

                    // Update Text
                    selectedText.textContent = option.textContent;

                    // Update Native Select Value
                    const value = option.getAttribute('data-value');
                    selectTipo.value = value;

                    // Close Dropdown
                    customSelect.classList.remove('open');

                    // Trigger Change Event Manually so other listeners run
                    selectTipo.dispatchEvent(new Event('change'));
                });
            });

            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (!customSelect.contains(e.target)) {
                    customSelect.classList.remove('open');
                }
            });
        }

        const updateInputs = () => {
            if (selectTipo.value === 'pf') {
                // Modo Pessoa Física: Mostra CPF (pf-inputs)
                pjInputs.style.display = 'none';
                pfInputs.style.display = 'flex';

                // Opcional: Limpar campos ao trocar para evitar envio de dados sujos
                // document.getElementById('agencia').value = '';
                // document.getElementById('conta').value = '';
            } else {
                // Modo Pessoa Jurídica: Mostra Agência e Conta (pj-inputs)
                pjInputs.style.display = 'flex';
                pfInputs.style.display = 'none';

                // Opcional: Limpar CPF
                // document.getElementById('cpf').value = '';
            }
        };

        // Escuta mudança no select
        selectTipo.addEventListener('change', updateInputs);

        // Inicializa estado correto ao carregar a página
        updateInputs();
    }

    // Swiper Slider Initialization
    const swiper = new Swiper('.hero-slider', {
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoHeight: false, /* Disabled globally, managed by breakpoints/CSS */
        effect: 'slide', /* Force slide effect */
        breakpoints: {
            320: {
                autoHeight: false, /* Fixed height on mobile via CSS */
            },
            993: {
                autoHeight: true, /* Auto height on desktop */
            }
        },
        on: {
            slideChangeTransitionStart: function () {
                const sliderContainer = document.querySelector('.hero-slider');
                // Use a small timeout or check the slides collection properly for loop mode
                const activeSlide = this.slides[this.activeIndex];

                // Logic Corrected:
                // Yellow Slide (Business) -> Needs BLACK dots (.dark-pagination)
                // Dark Slides (Cashback/Premium) -> Needs YELLOW dots (Default, remove class)
                if (activeSlide && activeSlide.classList.contains('slide-business')) {
                    sliderContainer.classList.add('dark-pagination');
                } else {
                    sliderContainer.classList.remove('dark-pagination');
                }


            }
        }
    });

    // Initial check for pagination color logic (since event only fires on change)
    if (swiper.slides[swiper.activeIndex].classList.contains('slide-business')) {
        document.querySelector('.hero-slider').classList.add('dark-pagination');
    }

    // Intersection Observer for Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optativo: parar de observar após animar uma vez
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1, // Dispara quando 10% do elemento está visível
        rootMargin: '0px 0px -50px 0px' // Dispara um pouco antes de entrar totalmente
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Sub-header Scroll Logic (Mobile)
    const subHeaderContainer = document.querySelector('.sub-header-container-mobile');
    const subHeaderMenu = document.querySelector('.sub-header-menu');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    if (subHeaderMenu && leftArrow && rightArrow) {
        const updateArrows = () => {
            const scrollLeft = subHeaderMenu.scrollLeft;
            const scrollWidth = subHeaderMenu.scrollWidth;
            const clientWidth = subHeaderMenu.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            
            // Show/Hide Left Arrow
            if (scrollLeft > 5) {
                leftArrow.classList.add('visible');
            } else {
                leftArrow.classList.remove('visible');
            }

            // Show/Hide Right Arrow
            // Tolerance of 5px to handle potential rounding issues
            if (scrollLeft >= maxScroll - 5) {
                rightArrow.classList.remove('visible');
            } else {
                rightArrow.classList.add('visible');
            }
        };

        // Click Events
        leftArrow.addEventListener('click', () => {
            subHeaderMenu.scrollBy({ left: -150, behavior: 'smooth' });
        });

        rightArrow.addEventListener('click', () => {
            subHeaderMenu.scrollBy({ left: 150, behavior: 'smooth' });
        });

        // Scroll Event
        subHeaderMenu.addEventListener('scroll', updateArrows);

        // Initial Check & Resize
        updateArrows();
        window.addEventListener('resize', updateArrows);
    }
});
