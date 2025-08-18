"use client";

import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { BarChart, Code, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";

export default function SignupForm() {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="w-full max-w-md">
				<Card className="border-none shadow-lg pb-0">
					<CardHeader className="flex flex-col items-center space-y-1.5 pb-4 pt-6">
						<Code className="w-12 h-12" />
						<div className="space-y-0.5 flex flex-col items-center">
							<h2 className="text-2xl font-semibold text-foreground">Create an account</h2>
							<p className="text-muted-foreground">Welcome! Create an account to get started.</p>
						</div>
					</CardHeader>
					<CardContent className="space-y-6 px-8">
						<div className="space-y-2">
							<Label htmlFor="role">Role</Label>
							<Select defaultValue="designer">
								<SelectTrigger id="role" className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
									<SelectItem value="designer">
										<User size={16} aria-hidden="true" />
										<span className="truncate">Product Designer</span>
									</SelectItem>
									<SelectItem value="developer">
										<Code size={16} aria-hidden="true" />
										<span className="truncate">Developer</span>
									</SelectItem>
									<SelectItem value="manager">
										<BarChart size={16} aria-hidden="true" />
										<span className="truncate">Product Manager</span>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First name</Label>
								<Input id="firstName" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last name</Label>
								<Input id="lastName" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input id="username" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email address</Label>
							<Input id="email" type="email" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input id="password" type={showPassword ? "text" : "password"} className="pr-10" />
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</Button>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox id="terms" />
							<label htmlFor="terms" className="text-sm text-muted-foreground">
								I agree to the Terms and Conditions
							</label>
						</div>

						<Button className="w-full bg-primary text-primary-foreground">Create free account</Button>
					</CardContent>
					<CardFooter className="flex justify-center border-t !py-4">
						<p className="text-center text-sm text-muted-foreground">Already have an account? Sign in</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}


