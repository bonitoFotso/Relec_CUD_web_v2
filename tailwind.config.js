/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
	
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
			  colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				warning: {
				  DEFAULT: "hsl(var(--warning))",
				  foreground: "hsl(var(--warning-foreground))",
				},
				primary: {
				  DEFAULT: "hsl(var(--primary))",
				  foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
				  DEFAULT: "hsl(var(--secondary))",
				  foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
				  DEFAULT: "hsl(var(--destructive))",
				  foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
				  DEFAULT: "hsl(var(--muted))",
				  foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
				  DEFAULT: "hsl(var(--accent))",
				  foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
				  DEFAULT: "hsl(var(--popover))",
				  foreground: "hsl(var(--popover-foreground))",
				},
				card: {
				  DEFAULT: "hsl(var(--card))",
				  foreground: "hsl(var(--card-foreground))",
				},
				chart: {
				  1: "hsl(var(--chart-1))",
				  2: "hsl(var(--chart-2))",
				  3: "hsl(var(--chart-3))",
				  4: "hsl(var(--chart-4))",
				  5: "hsl(var(--chart-5))",
				}
			  },
			  borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			  },
			  keyframes: {
				"fade-in": {
				  "0%": { opacity: 0, transform: "translateY(-10px)" },
				  "100%": { opacity: 1, transform: "translateY(0)" },
				},
				"float": {
				  "0%, 100%": { transform: "translateY(0px)" },
				  "50%": { transform: "translateY(-10px)" },
				},
				"pulse-slow": {
				  "0%, 100%": { transform: "scale(1)" },
				  "50%": { transform: "scale(1.05)" },
				},
				"shimmer": {
				  "0%": { backgroundPosition: "-1000px 0" },
				  "100%": { backgroundPosition: "1000px 0" },
				},
				"accordion-down": {
				  from: { height: 0 },
				  to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
				  from: { height: "var(--radix-accordion-content-height)" },
				  to: { height: 0 },
				},
			  },
			  animation: {
				"fade-in": "fade-in 0.2s ease-out",
				"float": "float 6s ease-in-out infinite",
				"pulse-slow": "pulse-slow 3s ease-in-out infinite",
				"shimmer": "shimmer 2s infinite",
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			  },
			  boxShadow: {
				'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
			  },
			  backdropBlur: {
				'glass': '10px',
			  },
		
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

