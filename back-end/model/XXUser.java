// @Entity
// public class XXUser {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @NotBlank(message = "Name is required.")
//     private String name;

//     @NotNull(message = "Email is required.")
//     @Email(message = "Email must be a valid email format.")
//     private String email;

//     @NotBlank(message = "Password is required.")
//     private String password;

//     public User() {}

//     public User(String name, String email, String password) {
//         setName(name);
//         setEmail(email);
//         setPassword(password);
//     }

//     public Long getId() {
//         return id;
//     }
//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getName() {
//         return name;
//     }

//     public void setName(String name) {
//         this.name = name;
//     }

//     public String getEmail() {
//         return email;
//     }

//     public void setEmail(String email) {
//         this.email = email;
//     }

//     public String getPassword() {
//         return password;
//     }

//     public void setPassword(String password) {
//         this.password = password;
//     }
// }