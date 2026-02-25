
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;

public class ModelTest {
    public static void main(String[] args) {
        try {
            String apiKey = "AIzaSyCFCY9zzgQhvTYgxbtpDelGcaoiUYyn1Zw";
            // Using gemini-flash-latest as configured in application.yaml
            String model = "gemini-flash-latest";
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key="
                    + apiKey;

            String jsonBody = "{\"contents\":[{\"parts\":[{\"text\":\"Hello, are you working?\"}]}]}";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(BodyPublishers.ofString(jsonBody))
                    .build();

            System.out.println("Testing model: " + model);
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response Body: " + response.body());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
